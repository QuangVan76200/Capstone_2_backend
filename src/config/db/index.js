const mongoose = require('mongoose');

async function connection() {
    try {
        //mongodb://localhost:27017/Artemis
        await mongoose.connect(process.env.DATABASE_LOCAL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('connect successfully!');
    } catch (error) {
        console.log('connect failure!', error);
    }
}

// chung

module.exports = {
    connection
};