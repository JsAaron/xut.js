
//屏幕尺寸
var screenWidth = window.screen.width
var screenHeight = window.screen.height

//可视区尺寸
var visualWidth = document.documentElement.clientWidth
var visualHeight = document.documentElement.clientHeight

/**
 * 高度marginTop - marginBottom处理了
 * 不一定等于设备高度
 */
var newViewHight = 0

/**
 * 创建分栏的新结构
 * 在分栏的数据之前包裹一层新的结构
 * 设置这个包裹容器的相关的column参数
 */
function createStr(chapterId, data, visualWidth, visualHeight, margin) {
    var percentageTop = Number(margin[0]);
    var percentageLeft = Number(margin[1]);
    var percentageBottom = Number(margin[2]);
    var percentageRight = Number(margin[3]);
    //减去的宽度值
    var negativeWidth = visualWidth / 100 * (percentageLeft + percentageRight);
    //减去的高度值
    var negativeHeight = visualHeight / 100 * (percentageTop + percentageBottom);
    //容器宽度 = 宽度 - 左右距离比值
    var containerWidth = visualWidth - negativeWidth;
    //容器高度值 = 宽度 - 上下距离比值
    var containerHeight = visualHeight - negativeHeight;
    //容器左边偏移量
    var containerLeft = negativeWidth / 2;
    //容器上偏移量
    var containerTop = visualHeight / 100 * percentageTop;
    var columnGap = 'column-gap:' + negativeWidth + 'px';
    var columnWidth = 'column-width:' + containerWidth + 'px';

    var container = '<section class="section-transform" data-flow="true">'+
                        '<div class="page-flow-pinch" data-role="margin" '+
                              'style="width:' + containerWidth + 'px;'+
                                     'height:' + containerHeight + 'px;'+
                                     'margin-top:' + containerTop + 'px;'+
                                     'margin-left:' + containerLeft + 'px;">'+
                            '<div data-role="column" '+
                                  'id="columns-content" '+
                                  'style="' + columnWidth + ';height:100%;' + columnGap + '">' + data +
                            '</div>'+
                        '</div>'+
                    '</section>';

    newViewHight = containerHeight;
    return container
};


/**
 * 插入分栏结构
 * 因为分栏还设置了margin，所以实际的内容是需要减去margin的数据
 */
function insertColumn(seasonNode) {
    for (var i = 0; i < seasonNode.childNodes.length; i++) {
        var chapterNode = seasonNode.childNodes[i];
        if (chapterNode.nodeType == 1) {
            var tag = chapterNode.id;
            var id = tag.match(/\d/)[0];
            //传递的数据
            var margin = chapterNode.getAttribute('data-margin');
            if (margin) {
                margin = margin.split(",");
            } else {
                margin = [0, 0, 0, 0];
            }
            chapterNode.innerHTML = createStr(id, chapterNode.innerHTML, visualWidth, visualHeight, margin);
        }
    }
};

/**
 * 解析分栏的实际高度
 */
function resolveCount(show,$content) {
    var theChildren = $content.find('#columns-content').children();
    var paraHeight = 0;
    for (var i = 0; i < theChildren.length; i++) {
         paraHeight += Math.max(theChildren[i].scrollHeight,theChildren[i].clientHeight)
    }
    $("#test123").append('<p>'+ show +'：溢出高度: '+ paraHeight + ', 分页数: '+ Math.ceil(paraHeight / newViewHight) +'</p>')
    return Math.ceil(paraHeight / newViewHight);
};

/**
 * 开始分栏
 * @return {[type]} [description]
 */
function initColumn() {

    //分栏数
    var columnCount = {}

    //分栏数据
    var $seasons = $container.children()
    var seasonNode = $seasons[0]

    //设置分栏容器的实际尺寸
    $container.css({
        width: visualWidth,
        height: visualHeight,
        display: 'block'
    })

    //给数据包裹一层分栏结构
    //让浏览器动态分页
    insertColumn(seasonNode)

    //显示到页面
    $('body').append($container)

    resolveCount('立刻获取',$seasons.children())

    setTimeout(function(){
        resolveCount('等待2秒',$seasons.children())
    },2000)

}