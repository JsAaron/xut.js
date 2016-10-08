import { config } from '../config/index'
import Bar from './base/bar'

import {
    getBeforeCount,
    getCurrentBeforeCount
} from '../component/flow/get'

/**
 * 页码显示
 */
export default class NumberBar extends Bar {

    constructor({
        $rootNode,
        pageTotal,
        currentPage
    }) {
        super()

        this.type = 'pageNumber'

        this.$container = this._createDom(pageTotal)
        this.$currtNode = this.$container.find('div:first')
        this.$allNode = this.$container.find('div:last')

        Xut.nextTick(() => {
            $rootNode.append(this.$container)
        })
    }

    _createDom(pageTotal) {
        //存在模式3的情况，所以页码要处理溢出的情况。left值
        let right = '.2rem'
        if(config.viewSize.left){
            right = Math.abs(config.viewSize.left) + 5  + 'px'
        }
        return $(
            `<div class="xut-page-number" style="right:${right};">
                <div>1</div>
                <strong>/</strong>
                <div>${pageTotal}</div>
             </div>`)
    }

    showNumberBar(){
        this.$container.show()
    }

    hideNumberBar(){
        this.$container.hide()
    }

    /**
     * 更新页码
     * @return {[type]} [description]
     */
    updatePointer({
        action,
        direction,
        parentIndex,
        hasSon = false,
        sonIndex = 0
    }) {

        const chapterData = Xut.Presentation.GetPageData('page', parentIndex)

        //从正索引开始
        ++parentIndex

        //默认，需要拿到前置的总和(出去当前)
        let beforeCount = getBeforeCount(chapterData.seasonId, chapterData._id)
        let updateIndex = parentIndex + beforeCount + sonIndex

        //前翻页，需要叠加flow的总和
        if (direction === 'prev') {
            //前翻页：内部翻页
            if (hasSon) {
                updateIndex = parentIndex + beforeCount + sonIndex - 2
            }
            //前翻页：外部往内部翻页，正好前一页是内部页，所以需要获取内部页总和
            else {
                //前翻页，需要拿到当期那到前置的总和
                updateIndex = parentIndex + getCurrentBeforeCount(chapterData.seasonId, chapterData._id)
            }
        }

        Xut.nextTick(() => {
            this.$currtNode.text(updateIndex)
            if (action === 'init') {
                this.$container.show()
            }
        })
    }

}
