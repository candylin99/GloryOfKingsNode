//这个模型存放Category的数据
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    //定义模型的字段
    name: { type: String },
    avatar: { type: String },
    banner: { type: String },

    cost: { type: String },
    // 在这里要知道一个英雄可能有两个职业，所以不能只有一个，得用一个数组装着
    categories: [
        { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }
    ],
    scores: {
        difficult: { type: Number },
        skills: { type: Number },
        attack: { type: Number },
        service: { type: Number },
        skin: { type: Number }
    },
    skills: [{
        icon: { type: String },
        name: { type: String },
        description: { type: String },
        tips: { type: String },
        cost: { type: String },
        delay: { type: String },
    }],
    items1: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Item'
    }],
    items2: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Item'
    }],
    usageTips: { type: String },
    battleTips: { type: String },
    teamtips: { type: String },
    partners: [{
        hero: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Hero"
        },
        description: { type: String }
    }],
})

module.exports = mongoose.model('Hero', schema, 'heroes')