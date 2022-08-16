import defaultSettings from '@/settings'
const defaultTitle = defaultSettings.title || 'Vue实践项目'
export default function getPageTitle(title) {
    if (title) {
        return defaultTitle + '-' + title
    }
    return defaultTitle
}