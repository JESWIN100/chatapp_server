import jwt from 'jsonwebtoken';

const jwtToken = (userId, res) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
        res.cookie('jwt', token, {
            maxAge: 30 * 24 * 60 * 60 * 1000, 
            httpOnly: true,
            sameSite: "None",
            secure: true 
        });
    } catch (error) {
        console.error("Error generating JWT:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default jwtToken;
