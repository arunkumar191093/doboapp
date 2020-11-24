import React from 'react'
import { View, StyleSheet } from 'react-native'
import BackgroundButton from './BackgroundButton'
import * as Constants from '../../services/Constants'
export default class TagsView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: props.selected
        }
    }
    render() {
        return (
            <View style={styles.container}>
                {this.makeButtons()}
            </View>
        )
    }
    onPress = (tag) => {
        let selected
        if (this.props.isExclusive) {
            selected = [tag]
        } else {
            selected = addOrRemove(this.state.selected, tag)
        }
        this.setState({
            selected
        })
        this.props.onTagSelected(tag)
    }
    makeButtons() {
        return this.props.all.map((tag, i) => {
            const on = this.state.selected.includes(tag)
            const backgroundColor = on ? Constants.DOBO_RED_COLOR : 'white'
            const textColor = on ? 'white' : 'grey'
            //const borderColor = on ? R.colors.on.border : R.colors.off.border
            return (
                <BackgroundButton
                    backgroundColor={backgroundColor}
                    textColor={textColor}
                    onPress={() => {
                        this.onPress(tag)
                    }}
                    key={i}
                    showImage={on}
                    title={tag} />
            )
        })
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: '5%',
        paddingTop: '5%'
    }
})

const addOrRemove = (array, item) => {
    const exists = array.includes(item)
    if (exists) {
        return array.filter((c) => { return c !== item })
    } else {
        const result = array
        result.push(item)
        return result
    }
}