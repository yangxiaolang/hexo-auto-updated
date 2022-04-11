const fs = require('fs')
const path = require('path')
const {
    throttor,
    debounce,
    dateFtt,
    loadUpdated
} = require('./utils/index')

const debounceRewrite = debounce(throttor(rewriteUpdated, 1000), 100)
const PostsDir = path.resolve('source/_posts')
const UpdatedMap = loadUpdated()

function rewriteUpdated(event, filename) {
    if (event === 'change') {
        const filepath = path.resolve(PostsDir, filename)
        const contentArray = fs.readFileSync(filepath).toString().split('\n')
        for (let index = 0; index < contentArray.length; index++) {
            if (contentArray[index + 1] === '---') {
                break
            }
            const matched = /updated: ([1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d)/g.exec(contentArray[index])
            if (matched) {
                rewrite(filename, contentArray, index, matched[1])
            }
        }

    }
}

function rewrite(filename, content, index, nowUpdated) {
    const cachedUpdated = UpdatedMap.get(filename)
    if (cachedUpdated) {
        if (new Date(cachedUpdated) > new Date(nowUpdated)) {
            return
        } else {
            const updatedTime = dateFtt('yyyy-MM-dd hh:mm:ss', new Date())
            content[index] = `updated: ${updatedTime}`
            fs.writeFileSync(path.resolve(PostsDir, filename), content.join('\n'))
            UpdatedMap.set(filename, updatedTime)
            console.log('done')
        }
    }

}

fs.watch(PostsDir, {}, debounceRewrite)