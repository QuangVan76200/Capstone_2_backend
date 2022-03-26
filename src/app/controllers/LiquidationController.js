const LiquidationModel = require('../models/LiquidationModel')
const Account = require('../models/OwnerModel')
const fs = require('fs');

class LiquidationController {
    async requestOne(request, respone) {

        try {
            const findProduct = await Product.findOne({
                _id: req.params.id
            }).populate('idOwner')

            if (findProduct) {
                return respone.json({
                    success: true,
                    findProduct: {
                        _id: findProduct._id,
                        titleProduct: findProduct.titleProduct,
                        priceProduct: findProduct.priceProduct,
                        amountProduct: findProduct.amountProduct,
                        comments: findProduct.comments,
                        imageProduct: process.env.API_URL + findProduct.imageProduct,
                        idOwner: findProduct.idOwner

                    }
                })
            } else {
                return respone.json({
                    success: false,
                    message: 'San pham khong ton tai'
                })
            }

        } catch (error) {
            return respone.json({
                success: false,
                message: 'Không tồn tại sản phẩm nào'
            })

        }


    }


    async requestAll(request, respone) {

        try {
            const findProduct = await LiquidationModel.find({});
            const findAccount = await Account.find({});
            console.log(findAccount);
            return respone.json({
                success: true,
                products: findProduct.map(value => {
                    return {
                        _id: value._id,
                        titleProduct: value.titleProduct,
                        priceProduct: value.priceProduct,
                        amountProduct: value.amountProduct,
                        imageProduct: value.imageProduct.map(value => process.env.API_URL + value.image),
                        comments: value.comments,
                        idOwner: value.idOwner
                    }
                }),
                message: 'succesfully',
            })

        } catch (error) {
            return respone.json({
                success: false,
                message: 'Không tồn tại sản phẩm nào'
            })
        }
    }
    async requestAllById(request, respone) {
        try {
            const findProduct = await LiquidationModel.find({
                idOwner: request.userId
            });
            return respone.json({
                success: true,
                products: findProduct.map(value => {
                    return {
                        _id: value._id,
                        titleProduct: value.titleProduct,
                        priceProduct: value.priceProduct,
                        amountProduct: value.amountProduct,
                        imageProduct: value.imageProduct.map(value => process.env.API_URL + value.image),
                        comments: value.comments,

                    }
                }),
                message: 'succesfully',
            })

        } catch (error) {
            return respone.json({
                success: false,
                message: 'Không tồn tại sản phẩm nào'
            })
        }
    }

    //[POST]
    async postProduct(request, response) {

        const {
            titleProduct,
            priceProduct,
            amountProduct,
        } = request.body

        if (!titleProduct) {
            console.log(titleProduct)
            return response.json({
                success: false,
                message: 'Title is required',
            })
        }
        try {
            const newProduct = await new LiquidationModel({
                titleProduct,
                priceProduct,
                amountProduct,
                imageProduct: request.files.map(value => {
                    return {
                        image: '/images/product/' + value.filename
                    }
                }),
                idOwner: request.userId
            }).save();
            return response.json({
                success: true,
                message: 'Thêm sản phẩm thành công',
                product: {
                    titleProduct: newProduct.titleProduct,
                    priceProduct: newProduct.priceProduct,
                    amountProduct: newProduct.amountProduct,
                    imageProduct: newProduct.imageProduct.map(value => process.env.API_URL + value.image),
                }
            })


        } catch (error) {
            console.log(error)
            return response.json({
                success: false,
                message: 'Internal server error'
            })
        }

    }

    async putProduct(request, response) {

        const {
            titleProduct,
            priceProduct,
            amountProduct,
        } = request.body


        console.log(request.body)

        if (!titleProduct) {
            console.log(titleProduct)
            return response.json({

                success: false,
                message: 'Title is required',
            })
        }
        try {
            const postData = {
                titleProduct,
                priceProduct: priceProduct || '',
                amountProduct: amountProduct || '',
                imageProduct: imageProduct || '',
            }

            const productUpdateCondition = {
                _id: req.params.id,
                idOwner: request.userId
            }

            const updatedProduct = await Product.findOneAndUpdate(productUpdateCondition, postData, {
                new: true
            });
            if (!updatedProduct) {
                return response.json({
                    success: false,
                    message: 'product not found or user not authorised'
                })
            }
            return response.json({
                success: true,
                message: 'Completed',
                updatedProduct: {
                    titleProduct: updatedProduct.titleProduct,
                    priceProduct: updatedProduct.priceProduct,
                    amountProduct: updatedProduct.amountProduct,
                    imageProduct: updatedProduct.imageProduct.map(value => process.env.API_URL + value.image),
                },
            })

        } catch (error) {
            return response.json({
                success: false,
                message: 'Internal server error'
            })
        }
    }

    async deleteProduct(request, respone) {
        const findLiquidation = await LiquidationModel.findOneAndDelete({
            _id: request.params.id,
            idOwner: request.userId
        });

        if (!findLiquidation) {
            return respone.json({
                success: false,
                message: 'post not found authorised'
            })
        } else {
            return respone.json({
                success: true,
                message: 'Completed',
                product: findLiquidation,
            })
        }

    }
}
module.exports = new LiquidationController;