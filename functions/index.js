const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.simulateEnergyData = functions.pubsub.schedule("every 1 minutes").onRun(async (context) => {
    const db = admin.database();
    const buildings = ["library", "labs", "canteen"];
    const now = Date.now();
    
    const updates = {};
    
    for (const b of buildings) {
        // Random energy value between 100-600
        const currentVal = Math.floor(Math.random() * (600 - 100 + 1)) + 100;
        
        // Update current value
        updates[`energy/${b}/current`] = currentVal;
        
        // Add to history
        const historyRef = db.ref(`energy/${b}/history`);
        await historyRef.push({
            timestamp: now,
            value: currentVal
        });
        
        // Prune history older than 24 hours
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        const oldItemsQuery = historyRef.orderByChild("timestamp").endAt(oneDayAgo);
        const oldItemsSnapshot = await oldItemsQuery.once("value");
        
        if (oldItemsSnapshot.exists()) {
            const oldItemsUpdates = {};
            oldItemsSnapshot.forEach((child) => {
                oldItemsUpdates[child.key] = null;
            });
            await historyRef.update(oldItemsUpdates);
        }
    }
    
    return db.ref().update(updates);
});