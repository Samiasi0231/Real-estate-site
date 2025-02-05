import JWT from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not Authenticated!" });
    }

    JWT.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid!" });
      }

      // Attach payload to the request object for subsequent handlers
      req.userId = payload.id;
      req.userRole = payload.role; // If you include roles or other claims in the token

      next(); // Proceed to the next middleware or route handler
    });
  } catch (err) {
    console.error("Error in verifyToken middleware:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
