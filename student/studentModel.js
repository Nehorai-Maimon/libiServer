const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    gender: {
        type: String,
        enum: ['נקבה', 'זכר'],
        required: true
    },
    DateOfBirth: {
        type: String,
        required: true
    },
    address: {
        city: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        other: {
            type: String,
        }
    },
    hmo: {
        type: String,
        enum: ['מאוחדת', 'לאומית', 'מכבי', 'כללית'],
        required: true
    },
    sensitivity: {
        type: String,
    },
    more: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    contact: [{
        contactFirstName: {
            type: String,
            required: true
        },
        contactLastName: {
            type: String,
            required: true
        },
        contactPhone: {
            type: String,
            required: true
        },
        contactEmail: {
            type: String,
            required: true
        },
        relative: {
            type: String,
            required: true
        },
        comment: {
            type: String,
        },
        apotropus: {
            type: Boolean,
            required: true
        }
    }],
    service: {
        type: Array,
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    days: [{
        year: {
            type: String,
            required: true
        },
        days: {
            type: Number,
            required: true
        }
    }],
    aboutStudent: String,
    aboutfamily: String,
    generalGoals: String,
    goalsToYear: String,
    medication: [{
        name: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
    }],
    arrServices: {
        type: Array,
        required: true
    },
    general: {
        files: [{
            inputName: String,
            fileName: String,
            filePath: String,
            date: {
                type: Date,
                default: new Date()
            },
            expirationDate: Date
        }],
        filesOp: [{
            inputName: String,
            fileName: String,
            filePath: String,
            date: {
                type: Date,
                default: new Date()
            }
        }]
    },
    housing: {
        files: [{
            inputName: String,
            fileName: String,
            filePath: String,
            date: {
                type: Date,
                default: new Date()
            },
            expirationDate: Date
        }],
        filesOp: [{
            inputName: String,
            fileName: String,
            filePath: String,
            date: {
                type: Date,
                default: new Date()
            }
        }]
    },
    employment: {
        files: [{
            inputName: String,
            fileName: String,
            filePath: String,
            date: {
                type: Date,
                default: new Date()
            },
            expirationDate: Date
        }],
        filesOp: [{
            inputName: String,
            fileName: String,
            filePath: String,
            date: {
                type: Date,
                default: new Date()
            }
        }]
    },
    club: {
        files: [{
            inputName: String,
            fileName: String,
            filePath: String,
            date: {
                type: Date,
                default: new Date()
            },
            expirationDate: Date
        }],
        filesOp: [{
            inputName: String,
            fileName: String,
            filePath: String,
            date: {
                type: Date,
                default: new Date()
            },
        }]
    },
    daycare: {
        general: {
            files: [{
                inputName: String,
                fileName: String,
                filePath: String,
                date: {
                    type: Date,
                    default: new Date()
                },
            }],
            filesOp: [{
                inputName: String,
                fileName: String,
                filePath: String,
                date: {
                    type: Date,
                    default: new Date()
                },
            }],
            year: [{
                year: String,
                team: String,
                tsa: {
                    date: String,
                    summary: String,
                    author: String
                },
                speech: {
                    files: [{
                        inputName: String,
                        fileName: String,
                        filePath: String,
                    }],
                    filesOp: [{
                        inputName: String,
                        fileName: String,
                        filePath: String,
                    }],
                    weeklySummary: [{
                        date: String,
                        summary: String,
                        author: String
                    }],
                    start: {
                        date: String,
                        summary: String,
                        author: String,
                    },
                    middle: {
                        date: String,
                        summary: String,
                        author: String
                    },
                    end: {
                        date: String,
                        summary: String,
                        author: String
                    },
                    // דוח טיפול קבוצתי
                    tsa: {
                        date: String,
                        summary: String,
                        author: String
                    }
                },
                occupation: {
                    files: [{
                        inputName: String,
                        fileName: String,
                        filePath: String,
                    }],
                    filesOp: [{
                        inputName: String,
                        fileName: String,
                        filePath: String,
                    }],
                    weeklySummary: [{
                        date: String,
                        summary: String,
                        author: String
                    }],
                    start: {
                        date: String,
                        summary: String,
                        author: String
                    },
                    middle: {
                        date: String,
                        summary: String,
                        author: String
                    },
                    end: {
                        date: String,
                        summary: String,
                        author: String
                    },
                    // דוח טיפול קבוצתי
                    tsa: {
                        date: String,
                        summary: String,
                        author: String
                    }
                },
                physiotherapy: {
                    files: [{
                        inputName: String,
                        fileName: String,
                        filePath: String,
                    }],
                    filesOp: [{
                        inputName: String,
                        fileName: String,
                        filePath: String,
                    }],
                    weeklySummary: [{
                        date: String,
                        summary: String,
                        author: String
                    }],
                    start: {
                        date: String,
                        summary: String,
                        author: String
                    },
                    middle: {
                        date: String,
                        summary: String,
                        author: String
                    },
                    end: {
                        date: String,
                        summary: String,
                        author: String
                    },
                    // דוח טיפול קבוצתי
                    tsa: {
                        date: String,
                        summary: String,
                        author: String
                    }
                },
                social: {
                    files: [{
                        inputName: String,
                        fileName: String,
                        filePath: String,
                    }],
                    filesOp: [{
                        inputName: String,
                        fileName: String,
                        filePath: String,
                    }],
                    weeklySummary: [{
                        date: String,
                        summary: String,
                        author: String
                    }],
                    goals: {
                        date: String,
                        summary: String,
                        author: String
                    },
                    tsa: {
                        date: String,
                        summary: String,
                        author: String
                    }
                },
                dietician: {
                    files: [{
                        inputName: String,
                        fileName: String,
                        filePath: String,
                    }],
                    filesOp: [{
                        inputName: String,
                        fileName: String,
                        filePath: String,
                    }],
                    tsa: {
                        date: String,
                        summary: String,
                        author: String
                    }
                },
                teacher: {
                    files: [{
                        inputName: String,
                        fileName: String,
                        filePath: String,
                    }],
                    filesOp: [{
                        inputName: String,
                        fileName: String,
                        filePath: String,
                    }],
                    tsa: {
                        date: String,
                        summary: String,
                        author: String
                    }
                },
                medical: {
                    files: [{
                        inputName: String,
                        fileName: String,
                        filePath: String,
                    }],
                    filesOp: [{
                        inputName: String,
                        fileName: String,
                        filePath: String,
                    }],
                    tsa: {
                        date: String,
                        summary: String,
                        author: String
                    }
                }
            }]
        }
    }
})

const studentModel = mongoose.model("student", studentSchema)

module.exports = studentModel