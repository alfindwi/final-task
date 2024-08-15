function hitungVoucher(voucher, uangBelanja) {
    
    const voucherData = {
        'DumbWaysJos' : {potongan: 0.211, minBelanja: 50000, maxDiskon: 20000},
        'DumbWaysMantap' : {potongan: 0.30, minBelanja: 80000, maxDiskon: 40000}
    } // mendefinisikan potongan, minimal belanja, dan maksimal diskon untuk masing-masing voucher

    const {potongan, minBelanja, maxDiskon} = voucherData[voucher]; // mendapatkan data voucher

    let diskon = 0;
    if (uangBelanja >= minBelanja) {
        diskon = uangBelanja * potongan;
        if (diskon > maxDiskon) {
            diskon = maxDiskon;
        }
    } // menghitung diskon dan uang yang harus dibayar

    const uangYangHarusDibayar = uangBelanja - diskon;
    const kembalian = uangBelanja - uangYangHarusDibayar;

    return `Uang yang harus dibayar : ${uangYangHarusDibayar}\nDiskon: ${diskon}\nKembalian : ${kembalian}`
}

console.log(hitungVoucher('DumbWaysJos', 100000))