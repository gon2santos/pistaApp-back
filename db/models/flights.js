const mongoose_1 = require("mongoose");
const flightSchema = new mongoose_1.Schema({
    destino: {
        type: String,
        required: true,
        unique: true,
    },
    carrusel: {
        type: String,
        required: true,
    },
}, {
    versionKey: false,
    timestamps: false,
});

exports.default = (0, mongoose_1.model)("Flight", flightSchema);