import JWT from 'jsonwebtoken'
import userModal from '../modals/userModal.js'

export const requireSignin = (req, res ,next) => {
    try{
        const token = req.headers.authorization
        const fetchUserId = JWT.verify(token, process.env.JWT_SECRET)
        req.user = fetchUserId
        next()
    }catch(error) {
        return res.status(401).send({
            success: false,
            message: 'Invalid or expired token, authorization denied.',
          });
    }
}

export const isAdmin = async (req, res, next) => {
  try {
    // Fetch the user from the database using the ID from the token
    const user = await userModal.findById(req.user._id);

    // Check if the user is found and has an admin role (assuming role 1 is admin)
    if (!user || user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized Access: Admins only",
      });
    }
    // If the user is an admin, continue to the next middleware/route handler
    next();
    
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Server Error: Unable to verify admin status',
      error: error.message,
    });
  }
};
