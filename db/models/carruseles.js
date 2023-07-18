const mongoose_1 = require("mongoose");
const carruselesSchema = new mongoose_1.Schema({
    direccion: {
        type: String,
        required: true,
        unique: true,
    },
    numero: {
        type: String,
        required: true,
    },
}, {
    versionKey: false,
    timestamps: false,
});

exports.default = (0, mongoose_1.model)("Carruseles", carruselesSchema);