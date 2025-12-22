// utils/inventoryManager.js
const InventoryHistory = require('../models/inventoryHistory');
const InventoryItem = require('../models/InventoryItem');
const Project = require('../models/Project');
const ServiceTicket = require('../models/ServiceTicket');

class InventoryManager {



    // Reserve inventory items for a project
    static async reserveItemsForProject(projectId, items, userId) {
        const project = await Project.findById(projectId);
        const errors = [];
        const historyRecords = [];

        for (const item of items) {
            const inventoryItem = await InventoryItem.findById(item.inventoryItem);

            if (!inventoryItem) {
                errors.push(`Inventory item ${item.inventoryItem} not found`);
                continue;
            }

            if (inventoryItem.quantityInStock < item.quantity) {
                errors.push(`Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.quantityInStock}, Requested: ${item.quantity}`);
                continue;
            }

            // Calculate costs
            const unitCost = inventoryItem.unitCost || 0;
            const totalCost = unitCost * item.quantity;

            // Add to project inventory
            project.inventoryItems.push({
                inventoryItem: item.inventoryItem,
                quantity: item.quantity,
                unitCost: unitCost,
                totalCost: totalCost,
                status: 'reserved',
                notes: item.notes
            });

            // Update stock
            inventoryItem.quantityInStock -= item.quantity;
            await inventoryItem.save();

            // Create history record
            const historyRecord = new InventoryHistory({
                inventoryItem: item.inventoryItem,
                type: 'out',
                quantity: item.quantity,
                previousStock: inventoryItem.quantityInStock + item.quantity,
                newStock: inventoryItem.quantityInStock,
                reference: `Project: ${project.title}`,
                referenceId: projectId,
                referenceType: 'project',
                notes: `Reserved for project`,
                createdBy: userId
            });
            await historyRecord.save();
            historyRecords.push(historyRecord);
        }

        await project.save();
        return { errors, historyRecords };
    }


    // Allocate inventory items for service ticket
    static async allocateItemsForServiceTicket(ticketId, items, userId) {
        const ticket = await ServiceTicket.findById(ticketId);
        if (!ticket) {
            throw new Error('Service ticket not found');
        }

        const historyRecords = [];
        const errors = [];

        for (const item of items) {
            try {
                const inventoryItem = await InventoryItem.findById(item.inventoryItem);
                if (!inventoryItem) {
                    errors.push(`Inventory item not found: ${item.inventoryItem}`);
                    continue;
                }

                // Check if sufficient stock is available
                if (inventoryItem.quantityInStock < item.quantity) {
                    errors.push(`Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.quantityInStock}, Requested: ${item.quantity}`);
                    continue;
                }

                // Allocate the items (reduce available stock)
                const previousStock = inventoryItem.quantityInStock;
                inventoryItem.quantityInStock -= item.quantity;
                await inventoryItem.save();

                // Add to service ticket inventory
                ticket.inventoryItems.push({
                    inventoryItem: item.inventoryItem,
                    quantity: item.quantity,
                    status: 'reserved',
                    notes: item.notes
                });

                // Create inventory history record
                const historyRecord = new InventoryHistory({
                    inventoryItem: item.inventoryItem,
                    type: 'out',
                    quantity: item.quantity,
                    previousStock,
                    newStock: inventoryItem.quantityInStock,
                    reference: `Service Ticket: ${ticket.ticketNumber}`,
                    referenceId: ticket._id,
                    referenceType: 'service_ticket',
                    notes: `Allocated for service ticket: ${ticket.title}. ${item.notes || ''}`,
                    createdBy: userId
                });

                await historyRecord.save();
                historyRecords.push(historyRecord);

            } catch (error) {
                errors.push(`Error processing ${item.inventoryItem}: ${error.message}`);
            }
        }

        await ticket.save();
        return { historyRecords, errors };
    }

    // Mark items as used (when actually installed/used)
    static async markItemsAsUsed(referenceType, referenceId, itemIds, userId) {
        let reference;

        if (referenceType === 'project') {
            reference = await Project.findById(referenceId);
        } else if (referenceType === 'service_ticket') {
            reference = await ServiceTicket.findById(referenceId);
        } else {
            throw new Error('Invalid reference type');
        }

        if (!reference) {
            throw new Error(`${referenceType} not found`);
        }

        for (const itemId of itemIds) {
            const item = reference.inventoryItems.id(itemId);
            if (item && item.status === 'reserved') {
                item.status = 'used';
                item.usedDate = new Date();
            }
        }

        await reference.save();
    }

    // Return items to inventory
    static async returnItemsToInventory(referenceType, referenceId, returnItems, userId) {
        let reference;

        if (referenceType === 'project') {
            reference = await Project.findById(referenceId);
        } else if (referenceType === 'service_ticket') {
            reference = await ServiceTicket.findById(referenceId);
        } else {
            throw new Error('Invalid reference type');
        }

        if (!reference) {
            throw new Error(`${referenceType} not found`);
        }

        const historyRecords = [];

        for (const returnItem of returnItems) {
            const item = reference.inventoryItems.id(returnItem.itemId);
            if (item && item.status !== 'returned') {
                const inventoryItem = await InventoryItem.findById(item.inventoryItem);

                if (inventoryItem) {
                    // Return to stock
                    const previousStock = inventoryItem.quantityInStock;
                    inventoryItem.quantityInStock += returnItem.quantityReturned;
                    await inventoryItem.save();

                    // Update item status
                    item.status = 'returned';
                    item.returnedDate = new Date();
                    item.notes = returnItem.notes;

                    // Create inventory history record
                    const historyRecord = new InventoryHistory({
                        inventoryItem: item.inventoryItem,
                        type: 'in',
                        quantity: returnItem.quantityReturned,
                        previousStock,
                        newStock: inventoryItem.quantityInStock,
                        reference: `${referenceType}: ${referenceType === 'project' ? reference.title : reference.ticketNumber}`,
                        referenceId: reference._id,
                        referenceType: referenceType,
                        notes: `Returned from ${referenceType}. ${returnItem.notes || ''}`,
                        createdBy: userId
                    });

                    await historyRecord.save();
                    historyRecords.push(historyRecord);
                }
            }
        }

        await reference.save();
        return historyRecords;
    }

    // Get available inventory items for elevator company
    static async getElevatorInventory() {

        return await InventoryItem.find().populate('supplier', 'companyName').sort({ name: 1 });
    }

    // Get low stock alerts for critical elevator parts
    static async getCriticalStockAlerts() {
        const criticalCategories = [
            'Safety Equipment',
            'Control Systems',
            'Door Systems'
        ];

        return await InventoryItem.find({
            category: { $in: criticalCategories },
            quantityInStock: { $lte: 2 }, // Very low threshold for critical parts
            isActive: true
        }).populate('supplier', 'companyName');
    }
}

module.exports = InventoryManager;