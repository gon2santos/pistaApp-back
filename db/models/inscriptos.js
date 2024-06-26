const mongoose_1 = require("mongoose");
const inscriptosSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: true,
    },
    dni: {
        type: Number,
        required: true,
        unique: true,
    },
    trabajo: {
        type: String,
        required: true,
    },
    puesto: {
        type: String,
        required: true,
    },
    tel: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    alim: {
        type: String,
    },
}, {
    versionKey: false,
    timestamps: false,
});

exports.default = (0, mongoose_1.model)("Inscriptos", inscriptosSchema);