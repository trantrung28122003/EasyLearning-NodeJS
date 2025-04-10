export const formatCurrency = (amount : any) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        minimumFractionDigits: 0
    }).format(amount);
};