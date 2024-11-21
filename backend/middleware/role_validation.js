export const IsManager = async(req,res, next)=>{
    const userRole = req.user.role
    if(userRole == 'manager'){
        next()
    }else{
        res.status(403).json({
            success: false,
            auth: false,
            message: 'You are not manager'
        })
    }
}
export const IsAdmin = async(req,res, next)=>{
    const userRole = req.user.role
    if(userRole == 'admin'){
        next()
    }else{
        res.status(403).json({
            success: false,
            auth: false,
            message: 'You are not admin'
        })
    }
}
export const IsKasir = async(req,res, next)=>{
    const userRole = req.user.role
    if(userRole == 'kasir'){
        next()
    }else{
        res.status(403).json({
            success: false,
            auth: false,
            message: 'You are not kasir'
        })
    }
}