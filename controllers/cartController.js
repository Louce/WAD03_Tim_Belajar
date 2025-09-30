const carts = {}; 

/**
 * [GET] /carts/:username
 * Mendapatkan isi keranjang belanja milik pengguna.
 */
exports.getCart = (req, res) => {
    const { username } = req.params;
    // Ambil keranjang, jika belum ada, kembalikan array kosong
    const cart = carts[username] || [];
    
    if (cart.length === 0) {
        return res.status(200).json({ message: "Keranjang kosong.", data: [] });
    }

    // Hitung total item unik di keranjang
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    res.status(200).json({
        message: `Keranjang user ${username} berhasil diambil.`,
        data: cart,
        totalItems: totalItems
    });
};

/**
 * [POST] /carts/:username/add
 * Menambahkan produk ke keranjang.
 * Body: { productId: string, quantity: number (default 1) }
 */
exports.addProductToCart = (req, res) => {
    const { username } = req.params;
    // Gunakan destructuring untuk mengambil productId dan set default quantity=1
    const { productId, quantity = 1 } = req.body;

    // Validasi dasar
    if (!productId || typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ message: "ID produk atau kuantitas tidak valid." });
    }

    // 1. Inisialisasi keranjang jika belum ada
    if (!carts[username]) {
        carts[username] = [];
    }

    const cart = carts[username];
    const existingItemIndex = cart.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
        // Produk sudah ada, tambahkan kuantitas
        cart[existingItemIndex].qty += quantity;
    } else {
        // Produk baru, tambahkan ke keranjang
        cart.push({ productId, qty: quantity });
    }

    res.status(200).json({
        message: `Produk ${productId} berhasil ditambahkan/diupdate di keranjang ${username}.`,
        cart: carts[username]
    });
};

/**
 * [POST] /carts/:username/remove
 * Menghapus atau mengurangi kuantitas produk dari keranjang.
 * Body: { productId: string, quantity: number (opsional, jika kosong hapus semua) }
 */
exports.removeProductFromCart = (req, res) => {
    const { username } = req.params;
    const { productId, quantity } = req.body; 

    if (!productId) {
        return res.status(400).json({ message: "ID produk wajib diisi." });
    }

    const cart = carts[username];

    if (!cart || cart.length === 0) {
        return res.status(404).json({ message: "Keranjang kosong atau pengguna tidak ditemukan." });
    }

    const existingItemIndex = cart.findIndex(item => item.productId === productId);

    if (existingItemIndex === -1) {
        return res.status(404).json({ message: "Produk tidak ditemukan di keranjang." });
    }

    // Logika hapus sepenuhnya atau kurangi kuantitas
    if (quantity === undefined || quantity === null || quantity >= cart[existingItemIndex].qty) {
        // Hapus item sepenuhnya
        carts[username] = cart.filter(item => item.productId !== productId);
        return res.status(200).json({
            message: `Produk ${productId} berhasil dihapus sepenuhnya dari keranjang ${username}.`,
            cart: carts[username]
        });
    } else if (quantity > 0 && quantity <= cart[existingItemIndex].qty) {
        // Kurangi kuantitas
        cart[existingItemIndex].qty -= quantity;
        return res.status(200).json({
            message: `Kuantitas produk ${productId} berhasil dikurangi sebanyak ${quantity}. Sisa: ${cart[existingItemIndex].qty}`,
            cart: carts[username]
        });
    } else {
        return res.status(400).json({ message: "Kuantitas untuk menghapus tidak valid." });
    }
};
