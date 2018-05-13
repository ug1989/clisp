const mockSwiperList = [
    {
        imgSrc: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        title: 'AAAAAAAAAAA',
        summary: 'asdkhaslfhlashdlsakhdlsahlfksahdlkhsalda',
    },
    {
        imgSrc: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        title: 'BBBBBBBBBBB',
        summary: 'sfherwhfsdbcdshiofhelfdscnlkdshclsdkncdklscl',
    }
];
const mockContentList = [
    {
        imgSrc: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        title: 'CCCCCCCCCCCCCCCCCCC',
        summary: 'SAGDJKbjkAHSdkskjbsakjdgKBJAHSDKBASJDhlashdkabdliahslda',
    },
    {
        imgSrc: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        title: 'CCCCCCCCCCCCCCCCCCC',
        summary: 'SAGDJKbjkAHSdkskjbsakjdgKBJAHSDKBASJDhlashdkabdliahslda',
    },
    {
        imgSrc: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
        title: 'CCCCCCCCCCCCCCCCCCC',
        summary: 'SAGDJKbjkAHSdkskjbsakjdgKBJAHSDKBASJDhlashdkabdliahslda',
    }
];

Page({
    data: {
        swiperList: mockSwiperList || [],
        contentList: mockContentList || [],
        loadingMore: !true
    },
    loadMoreContent: function() {
        console.log('load more form bottom')
        this.setData({
            loadingMore: true
        })
        setTimeout(() => {
            this.data.contentList = this.data.contentList.concat(JSON.parse(JSON.stringify(mockContentList)))
            this.setData({
                contentList: this.data.contentList,
                loadingMore: false
            })
        }, 600)
    },
    toDetailPage: function(event) {
        const id = event.currentTarget.dataset.detailId
        wx.navigateTo({ url: `/page/detail/index?id=${id}` })
    }
});
