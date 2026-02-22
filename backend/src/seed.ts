import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product';
import Variant from './models/Variant';
import EmiPlan from './models/EmiPlan';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/emi-products';

const UNSPLASH_IMAGES = {
    iphone: [
        'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
        'https://images.unsplash.com/photo-1574755393849-623942496936?w=600&q=80',
    ],
    samsung: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
        'https://images.unsplash.com/photo-1562345804-29c18c61d9d0?w=600&q=80',
        'https://images.unsplash.com/photo-1706300896423-7d08346e8dbb?q=80&w=600',
    ],
    oneplus: [
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80',
        'https://images.unsplash.com/photo-1568586236850-9cf8bca5cb6e?w=600&q=80',
        'https://images.unsplash.com/photo-1631281956016-3cdc1b2fe5fb?w=600&q=80',
    ],
};

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        await Product.deleteMany({});
        await Variant.deleteMany({});
        await EmiPlan.deleteMany({});
        console.log('Cleared existing data');

        // ─── iPhone 17 Pro ───────────────────────────────────────────────
        const iphone = await Product.create({
            name: 'Apple iPhone 17 Pro',
            slug: 'iphone-17-pro',
            description:
                "The iPhone 17 Pro features Apple's next-gen A19 Pro chip, a revolutionary camera system with 5x optical zoom, and a titanium design for unmatched performance and durability.",
            category: 'Smartphones',
            brand: 'Apple',
            imageUrl: UNSPLASH_IMAGES.iphone[0],
        });

        await Variant.insertMany([
            {
                productId: iphone._id,
                label: '256 GB – Natural Titanium',
                storage: '256 GB',
                color: 'Natural Titanium',
                mrp: 134900,
                price: 129900,
                images: [UNSPLASH_IMAGES.iphone[0], UNSPLASH_IMAGES.iphone[1]],
            },
            {
                productId: iphone._id,
                label: '512 GB – Black Titanium',
                storage: '512 GB',
                color: 'Black Titanium',
                mrp: 154900,
                price: 149900,
                images: [UNSPLASH_IMAGES.iphone[2], UNSPLASH_IMAGES.iphone[0]],
            },
            {
                productId: iphone._id,
                label: '1 TB – White Titanium',
                storage: '1 TB',
                color: 'White Titanium',
                mrp: 174900,
                price: 169900,
                images: [UNSPLASH_IMAGES.iphone[1], UNSPLASH_IMAGES.iphone[2]],
            },
        ]);

        // EMI plans: tenure (months) + interestRate (% p.a.) — monthlyAmount computed by backend
        await EmiPlan.insertMany([
            {
                productId: iphone._id,
                label: '3-Month No-Cost EMI',
                tenure: 3,
                interestRate: 0,
                cashback: 2000,
                cashbackDescription: '₹2,000 cashback via HDFC Credit Card',
                isPopular: false,
            },
            {
                productId: iphone._id,
                label: '6-Month EMI',
                tenure: 6,
                interestRate: 6.5,
                cashback: 1500,
                cashbackDescription: '₹1,500 cashback via ICICI Credit Card',
                isPopular: true,
            },
            {
                productId: iphone._id,
                label: '9-Month EMI',
                tenure: 9,
                interestRate: 10.5,
                cashback: 0,
                cashbackDescription: '',
                isPopular: false,
            },
            {
                productId: iphone._id,
                label: '12-Month EMI',
                tenure: 12,
                interestRate: 14,
                cashback: 0,
                cashbackDescription: '',
                isPopular: false,
            },
        ]);

        console.log('✅ iPhone 17 Pro seeded');

        // ─── Samsung Galaxy S25 Ultra ─────────────────────────────────────
        const samsung = await Product.create({
            name: 'Samsung Galaxy S25 Ultra',
            slug: 'samsung-galaxy-s25-ultra',
            description:
                'The Galaxy S25 Ultra redefines what a smartphone can do with Snapdragon 8 Elite, a built-in S Pen, and AI-powered camera features for pro-grade photography.',
            category: 'Smartphones',
            brand: 'Samsung',
            imageUrl: UNSPLASH_IMAGES.samsung[0],
        });

        await Variant.insertMany([
            {
                productId: samsung._id,
                label: '256 GB – Titanium Gray',
                storage: '256 GB',
                color: 'Titanium Gray',
                mrp: 131999,
                price: 124999,
                images: [UNSPLASH_IMAGES.samsung[0], UNSPLASH_IMAGES.samsung[1]],
            },
            {
                productId: samsung._id,
                label: '512 GB – Titanium Black',
                storage: '512 GB',
                color: 'Titanium Black',
                mrp: 151999,
                price: 144999,
                images: [UNSPLASH_IMAGES.samsung[2], UNSPLASH_IMAGES.samsung[0]],
            },
            {
                productId: samsung._id,
                label: '1 TB – Titanium WhiteSilver',
                storage: '1 TB',
                color: 'Titanium WhiteSilver',
                mrp: 167999,
                price: 159999,
                images: [UNSPLASH_IMAGES.samsung[1], UNSPLASH_IMAGES.samsung[2]],
            },
        ]);

        await EmiPlan.insertMany([
            {
                productId: samsung._id,
                label: '3-Month No-Cost EMI',
                tenure: 3,
                interestRate: 0,
                cashback: 3000,
                cashbackDescription: '₹3,000 cashback via Samsung Credit Card',
                isPopular: false,
            },
            {
                productId: samsung._id,
                label: '6-Month EMI',
                tenure: 6,
                interestRate: 6.5,
                cashback: 2000,
                cashbackDescription: '₹2,000 cashback via Axis Credit Card',
                isPopular: true,
            },
            {
                productId: samsung._id,
                label: '9-Month EMI',
                tenure: 9,
                interestRate: 10.5,
                cashback: 0,
                cashbackDescription: '',
                isPopular: false,
            },
            {
                productId: samsung._id,
                label: '12-Month EMI',
                tenure: 12,
                interestRate: 14,
                cashback: 0,
                cashbackDescription: '',
                isPopular: false,
            },
        ]);

        console.log('✅ Samsung Galaxy S25 Ultra seeded');

        // ─── OnePlus 13 ───────────────────────────────────────────────────
        const oneplus = await Product.create({
            name: 'OnePlus 13',
            slug: 'oneplus-13',
            description:
                'OnePlus 13 brings flagship performance with Snapdragon 8 Gen 4, a Hasselblad-tuned triple camera, 100W SuperVOOC charging, and a stunning 2K AMOLED display.',
            category: 'Smartphones',
            brand: 'OnePlus',
            imageUrl: UNSPLASH_IMAGES.oneplus[0],
        });

        await Variant.insertMany([
            {
                productId: oneplus._id,
                label: '256 GB – Midnight Ocean',
                storage: '256 GB',
                color: 'Midnight Ocean',
                mrp: 72999,
                price: 69999,
                images: [UNSPLASH_IMAGES.oneplus[0], UNSPLASH_IMAGES.oneplus[1]],
            },
            {
                productId: oneplus._id,
                label: '512 GB – Black Eclipse',
                storage: '512 GB',
                color: 'Black Eclipse',
                mrp: 82999,
                price: 79999,
                images: [UNSPLASH_IMAGES.oneplus[2], UNSPLASH_IMAGES.oneplus[0]],
            },
        ]);

        await EmiPlan.insertMany([
            {
                productId: oneplus._id,
                label: '3-Month No-Cost EMI',
                tenure: 3,
                interestRate: 0,
                cashback: 1000,
                cashbackDescription: '₹1,000 cashback via Kotak Credit Card',
                isPopular: false,
            },
            {
                productId: oneplus._id,
                label: '6-Month EMI',
                tenure: 6,
                interestRate: 6.5,
                cashback: 500,
                cashbackDescription: '₹500 cashback via HDFC Credit Card',
                isPopular: true,
            },
            {
                productId: oneplus._id,
                label: '9-Month EMI',
                tenure: 9,
                interestRate: 10.5,
                cashback: 0,
                cashbackDescription: '',
                isPopular: false,
            },
            {
                productId: oneplus._id,
                label: '12-Month EMI',
                tenure: 12,
                interestRate: 14,
                cashback: 0,
                cashbackDescription: '',
                isPopular: false,
            },
        ]);

        console.log('✅ OnePlus 13 seeded');

        console.log('\n🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
}

seed();
