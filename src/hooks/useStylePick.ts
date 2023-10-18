import { textDefaultProps } from '@/components/editor/defaultProps'
import { pick, without } from 'lodash'
import { computed } from 'vue'

export const defaultStyles = without(Object.keys(textDefaultProps), 'actionType', 'url', 'text')

export const useStylePick = (props: any, pickStyles = defaultStyles) => {
  return computed(() => pick(props, pickStyles))
}
