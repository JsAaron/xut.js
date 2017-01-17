import { config } from '../config/index'

import {
    hasColumn,
    getBeforeCount,
    getCurrentBeforeCount
} from '../scenario-core/component/column/get'

/**
 * 页码显示
 */
export default class NumberBar {

    constructor({
        $rootNode,
        pageTotal,
        currentPage
    }) {
        this.$container = this._createDom(pageTotal)
        this.$currtNode = this.$container.find('div:first')
        this.$allNode = this.$container.find('div:last')

        this.toolBarStatus = true

        Xut.nextTick(() => {
            $rootNode.append(this.$container)
        })
    }

    _createDom(pageTotal) {
        //存在模式3的情况，所以页码要处理溢出的情况。left值
        let right = 0
        if (config.viewSize.overflowWidth) {
            right = Math.abs(config.viewSize.left * 2) + 'px'
        }
        return $(
            `<div class="xut-page-number" style="right:${right};">
                <div>1</div>
                <strong>/</strong>
                <div>${pageTotal}</div>
             </div>`)
    }

    _showToolBar() {
        this.$container.show()
    }

    _hideToolBar() {
        this.$container.hide()
    }

    toggle(state, pointer) {
        if (pointer !== 'pageNumber') return
        switch (state) {
            case 'show':
                this._showToolBar();
                break;
            case 'hide':
                this._hideToolBar();
                break;
            default:
                //默认：工具栏显示隐藏互斥处理
                this.toolBarStatus ? this._hideToolBar() : this._showToolBar();
                break;
        }
    }

    _updateText(action, updateIndex) {
        Xut.nextTick(() => {
            this.$currtNode.text(updateIndex)
            if (action === 'init') {
                this.$container.show()
            }
        })
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

        let chapterData = Xut.Presentation.GetPageData('page', parentIndex)

        //从正索引开始
        ++parentIndex

        if (!hasColumn()) {
            this._updateText(action, parentIndex)
            return
        }

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

        this._updateText(action, updateIndex)
    }

}
