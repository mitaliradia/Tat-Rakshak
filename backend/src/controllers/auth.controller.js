import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
export async function signup(req, res) {      //async -> promises
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are Required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must contain atleast 6 letters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Inavalid email format" });
        }

        const userExistingStatus = await User.findOne({ email });
        if (userExistingStatus) {
            return res.status(400).json({ message: "Email already exists" });
        }

        //random color - use api avatar
        // for avatar  
        const idx = Math.floor(Math.random() * 100) + 1;   // btw 1-100
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            email,
            password,
            profilePic: randomAvatar
        })

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY,
            {expiresIn: "7d"}
        );

        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
            httpOnly: true, //cookie is not accessible from client side  (prevents XSS attacks)
            sameSite: 'strict', //cookie is sent only to same site (prevents CSRF attacks)
            secure: process.env.NODE_ENV === 'production',
            path: '/' //cookie is sent only over HTTPS in production
        })

        res.status(201).json({ success: true, user: newUser })
    } catch (error) {
        console.log('Error in signup controller', error);
        res.status(500).json({ message: "Internal Server Error" });

    }

    // try {
    //     // ... (your user creation/validation logic) ...
    //     const newUser = await User.create({ fullName, email, password });

    //     // 1. Create a short-lived ACCESS TOKEN
    //     const accessToken = jwt.sign(
    //         { userId: newUser._id },
    //         process.env.JWT_ACCESS_SECRET, // Use the ACCESS secret
    //         { expiresIn: '15m' } // Expires in 15 minutes
    //     );

    //     // 2. Create a long-lived REFRESH TOKEN
    //     const refreshToken = jwt.sign(
    //         { userId: newUser._id },
    //         process.env.JWT_REFRESH_SECRET, // Use the REFRESH secret
    //         { expiresIn: '7d' } // Expires in 7 days
    //     );

    //     // 3. Store the REFRESH TOKEN in a secure httpOnly cookie
    //     res.cookie('jwt', refreshToken, {
    //         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    //         httpOnly: true,
    //         sameSite: 'strict',
    //         secure: process.env.NODE_ENV === 'production',
    //         path: '/'
    //     });

    //     // 4. Send the ACCESS TOKEN and user data in the JSON response
    //     res.status(201).json({
    //         success: true,
    //         user: {
    //             id: newUser._id,
    //             fullName: newUser.fullName,
    //             email: newUser.email
    //         },
    //         accessToken: accessToken // Client will use this for API requests
    //     });

    // } catch (error) {
    //     console.log('Error in signup controller', error);
    //     res.status(500).json({ message: "Internal Server Error" });
    // }
}

export async function signin(req, res) {
    res.send("sign in")
}

export function logout(req, res) {
    res.send(" logout")
}
