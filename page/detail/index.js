const mockGoodsList = [
    {
        imgSrc: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        title: 'AAAAAAAAAAA',
        price: 12.34,
    },
    {
        imgSrc: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        title: 'BBBBBBBBBBB',
        price: 41.32,
    }
];

Page({
    data: {
        showShare: false,
        showGoods: !false,
        content: null,
        goodsList: mockGoodsList || [],
    },
    toggleGoodsList: function() {
        const showGoods = !this.data.showGoods;
        this.setData({ showGoods });
    },
    onLoad: function() {
        // get detail id
        // Id ? get info : to index
    }
});
