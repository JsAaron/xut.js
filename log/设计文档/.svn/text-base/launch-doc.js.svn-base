/**************************************
 *
 *   杂志的加载方式
 *
***************************************/
杂志加载分2种方式
1：老版本的直接加载xxtppt.js就可以了，xxtppt.js内部会自动直接加载应用
2：新版本加载xxtppt.js后，不会启动应用，必须通过接口启动，这样其实更好
新旧两种方式是共存的，所以需要启动第2中方式，我们需要配置一些参数



/**************************************
 *
 *   新版配置
 *
***************************************/
大的方面，新版分为3个大的接口
加载应用： Xut.Application.Launch()
销毁应用： Xut.Application.Destroy()
还有一个比较特殊的：Xut.Application.Exit() 只销毁当前应用的必须资源，保留基础的数据，可以直接切换不同应用

Destroy与Exit简单的区别：
1：xxtppt.js是不是共享的，如果共享了一个xxtppt.js，那么意味着应用切换的时候xxtppt.js文件不会再次加载，所以我们每次销毁页面只能用Exit,这样xxtppt.js的基础依赖不会被销毁，只会销毁当前被切换的应用
2：只有当我们完整的退出应用，意味着xxtppt.js都不需要的时候就可以用Destroy方法了


/**************************************
 *
 *  看一个简单的配置文件
 *
***************************************/
Xut.Application.setConfig = {
    lauchMode: 1,
    platform: 'mini',
    historyMode: true,
    visualMode: 2,
    salePageType: 'page',
    cursor: {
        url: 'images/icons/busyIcon.gif',
        delayTime: 300
    },
    hqUrlSuffix: 'hi',
    supportQR: true,
    swipeDelegate: true
};

Xut.Application.Launch({
    el: '#xxtppt-app-container', //根节点
    launchAnim: false,
    convert: 'svg',
    path: {
        //网络资源
        resource: 'http://192.168.1.113:8000/d/svn/www/www-dev-new/src/content/310',
        database: 'http://192.168.1.113:8000/d/svn/www/www-dev-new/src/content/310/SQLResult.js'
    }
});



/**************************************
 *
 *  关于Xut.Application.setConfig‘
 *
 *  这是全局设置，意味着所有依赖当前xxtppt.js的应用都会使用这些配置
 *
***************************************/


// 如果采用了新版模式进应用，也就是通过Xut.Application.Launch接口加载应用，这个设置必须打开，写参数1，否则会默认走第一种模式
//内部默认参数：0
lauchMode: 1

// 是否允许杂志快速翻页，默认是允许的，因为杂志引入了一个多线程的概念，所以可以在没创建完毕的就可以翻页
// 如果想每个页面都必须创建完后，再相应用户的翻页，就关闭填 false
//内部默认参数：true
quickFlip: true

//明确是mini杂志平台，这个目前只用来去掉背景图的加载
//内部默认参数：无
platform: 'mini'

//是否支持二维码图片的相应,可选参数 true / false
//内部默认参数： true
supportQR: true

//单独配置忙碌光标的样式跟延时显示的时间
cursor: {
    delayTime: DEFAULT, //延时间显示时间
    url: DEFAULT //url
}

//配置高清图的标记
//比如图片是 xxxxx.jpg
//配置后: xxxxx.hi.jpg
hqUrlSuffix: 'hi'

//页面显示模式
//这是一个大选了
//默认参数：0  宽度100% 高度100%
//可选参数：2  按照宽度100%，自适应高度，高度如果溢出，就把高度设为100%
//可选参数：3  按照高度100%，自适应宽度
visualMode:0

//是否允许图片缩放
salePicture: true //默认启动图片缩放的
salePictureMultiples: 4 //默认缩放的倍数4倍


//是否允许页面缩放页面
//默认情况下页面是不允许被缩放的
 //  可选项，缩放流式页面  'flow'
 //         缩放page页面  'page'
 //         all全部支持   'all'
salePageType: 'page'


//是否需要保存记录加载。下次再进应用的时候是不是到最后一页，还是到第一页
//1 true 启动缓存
//2 false 关闭缓存
historyMode: DEFAULT, //默认不配置，这里需要数据库填充， 如果指定了false，跳过数据库填充


/**
 * 滑动事件委托
 * 这个东东是针对mini开发的
 * 左右翻页手势提升到全局响应
 * 相应的对象形成形成事件队列
 * [content1,content2,...,翻页]
 * 1 true 启动
 * 2 false 禁止
 */
swipeDelegate: DEFAULT, //默认关闭，min杂志自动启用



/**************************************
 *
 *  关于Xut.Application.Launch
 *
 *  针对每个应用单独配置
 *
***************************************/

/**
 * 指定应用的一个根节点
 * 用来把应用挂载到这个节点下面
 * @type {String}
 */
el: '#xxtppt-app-container'

/**
 * 为了加快启动，这个可以去掉启动动画
 * 默认是启动， 关闭用false
 */
launchAnim: false,

/**
 * 关闭忙了光标
 * 应用的忙了光标是否允许出现  false 就是关闭
 * 默认是启动的
 * @type {Boolean}
 */
cursor: false


/**
 * 这个很关键
 * 这个参数用于处理svg文件跨域问题
 * 应用的的资源来源于网络，那么svg的解析就会涉及跨域问题
 * 所以需要应用在打包的时候把svg先转化js规则后，
 * 然后这里启动这个配置，这样应用数据规定的所有取svg的数据，会默认去.js结尾的对应数据
 */
convert: 'svg'


/**
 * 配置资源的地址
 * 1 本地地址
 * 2 网络地址
 *
 * resource ：资源地址
 * database ： 数据库地址
 *
 */
path: {
	//本地资源
    resource: 'content/310',
    database: 'content/datacache/SQLResult.js'

    //网络资源
    resource: 'http://192.168.1.113:8000/d/svn/www/www-dev-new/src/content/310',
    database: 'http://192.168.1.113:8000/d/svn/www/www-dev-new/src/content/310/SQLResult.js'
}








