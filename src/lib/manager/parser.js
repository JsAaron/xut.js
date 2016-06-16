//查询接口
export function query(tableName, options, callback) {
    switch (tableName) {
        case 'page':
            //得到页面关联的数据
            return getPageData(options, callback);
        case 'master':
            //得到母版关联的数据
            return getMasterData(options, callback);
        case 'chapter':
            //得到chapter表数据
            return parseChapter(options)
        case 'scenarioChapter':
            return scenarioChapter(options);
    }
}

/**
 * 根据指定的chpaterId解析
 * @return {[type]} [description]
 */
function scenarioChapter(chapterId) {
    var chapterSection = Xut.data.chapterSection;
    var rang = chapterSection['seasonId->' + chapterId];
    return rang;
}


/*********************************************************************
 *
 *               1 解析chapter页面数据
 *               2 解析对应的Activity数据
 *               3 解析出自动widget数据结构
 *                                                         *
 **********************************************************************/
function getPageData(data, callback) {
    var parsePointer = data['pageIndex'],
        pageData = data['pageData'];

    if (pageData) {
        getActivity(pageData, callback);
    } else {
        //解析章节数据
        parseChapter(parsePointer, function(pageData) { //生成chapter数据
            getActivity(pageData.length ? pageData[0] : pageData, callback);
        });
    }
};

//解析关联的Activity表数据
function getActivity(pageData, callback) {
    parseActivity(pageData, function(activitys, autoData) {
        callback(pageData, activitys, autoData);
    });
}

/**
 * 递归分解
 * chpater直接对应页面的ID编码，直接去下标即可
 * waitCreatePointer     需要分解的页面
 */
function parseChapter(waitCreatePointer) {
    var chapters = [],
        chapter,
        dataChpater = Xut.data.Chapter,
        points = waitCreatePointer.length,
        key;

    while (points--) {
        key = waitCreatePointer[points];
        if (chapter = dataChpater.item(key)) {
            chapters.unshift(chapter);
        }
    }

    return chapters;
};


/*********************************************************************
 *
 *                解析视觉差的数据
 *                                                         *
 **********************************************************************/
function getMasterData(data, callback) {
    var pptMaster = data['pptMaster'];
    var masterDas = Xut.data.query('Master', pptMaster)
    parseActivity(masterDas, function(activitys, autoData) {
        callback(masterDas, activitys, autoData);
    });
}


/*********************************************************************
 *                解析activity表的数据
 *                                                         *
 **********************************************************************/
/**
 * chpaters = {
 *     pageIndex-12: Object
 *     pageIndex-13: Object
 *     pageIndex-14: Object
 *  }
 **/
function parseActivity(data, callback) {
    if (!data) callback();
    var activitys = [];
    var chapterId = data['_id'];

    Xut.data.query('Activity', chapterId, 'chapterId', function(item) {
        activitys.push(item);
    })

    //混入文本提示框
    mixShowNote(data, activitys);

    //自动运行的数据
    //解析出每一页自动运行的 Widget,Action,Video数据
    var autoData = filterAutoRun(activitys);

    callback(activitys, autoData);
};


/**
 * 混入shownote
 * 组合showNote数据,弹出信息框,也看作一个热点
 * shownote是chater的信息，混入到activity列表中当作每页的对象处理
 * @return {[type]} [description]
 */
function mixShowNote(onechapter, activitydata) {
    if (onechapter.note) {
        activitydata.push(onechapter);
    }
};


//解析出页面自动运行的数据
function filterAutoRun(activitys) {

    var collectAutoBuffers, key, id, key, sub;

    if (!activitys || !activitys.length) return;

    collectAutoBuffers = []; //自动热点

    activitys.forEach(function(target, b) {
        //如果是自动播放,并且满足自定义条件
        //并且不是content类型
        if (target.autoPlay && target.actType !== 'Content') {
            //增加note提示信息数据
            id = target['_id'];
            key = target.actType ? target.actType + "_" + id : 'showNote_' + id;
            sub = {
                'id': id,
                'type': target.actType,
                'animation': target.animation,
                'key': key,
                'category': target.category,
                'autoPlay': target.autoPlay
            };
            collectAutoBuffers.push(sub);
        }
    })

    if (collectAutoBuffers.length) {
        return collectAutoBuffers;
    }
}
