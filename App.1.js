// TODO: refactoring...

import React, { Component } from 'react';
import { Alert,AppRegistry, Animated,StyleSheet, 
  Text, View, Image, Button, PanResponder,TextInput, StatusBar  } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { createResponder } from 'react-native-gesture-responder'

const CIRCLE_RADIUS = 36;
const styles = StyleSheet.create({
  bigblue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },
  circle      : {
    backgroundColor     : '#1abc9c',
    width               : CIRCLE_RADIUS*2,
    height              : CIRCLE_RADIUS*2,
    borderRadius        : CIRCLE_RADIUS*1
  },
  outer_circle      : {
    // backgroundColor     : '#1abc9c',
    width               : CIRCLE_RADIUS*6,
    height              : CIRCLE_RADIUS*6,
    borderRadius        : CIRCLE_RADIUS*3,
    borderColor         : '#1abc9c',
    borderWidth:1,
    alignItems:'center',
    justifyContent:'center'
  },
  circle_m      : {
    // backgroundColor     : '#1abc9c',
    width               : CIRCLE_RADIUS*2,
    height              : CIRCLE_RADIUS*2,
    borderRadius        : CIRCLE_RADIUS*1,
    borderColor         : '#1abc9c',
    borderWidth:1,
    alignItems:'center',
    justifyContent:'center',
  }
});

export default class AppView extends Component {

  _onPressButton() {
    // Alert.alert('You tapped the button!');
    this.sock = new WebSocket(this.state.ipAddrText);

    // https://qiita.com/KeyG/items/307ffbe688e45e6dd413
    this.sock.addEventListener('open',function(e){
      this.sock.send("from react native!");
    }.bind(this));
    this.sock.addEventListener('message',function(e){
      this.setState({base64img: 'data:image/jpeg;base64,' + e.data});   
    }.bind(this)); 
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e, gestureState) => {
        // Set the initial value to the current state
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
        Animated.spring(
          this.state.scale,
          { toValue: 1.1, friction: 3 }
        ).start();
      },

      // When we drag/pan the object, set the delate to the states pan position
      // onPanResponderMove: Animated.event([
      //   null, {dx: this.state.pan.x, dy: this.state.pan.y},
      // ]),

      // https://stackoverflow.com/questions/36637321/pass-an-anonymous-function-to-onpanrespondermove
      onPanResponderMove: (e, gestureState) => {
        console.log(this.state.pan);
        // if(this.state.pan.x > 50){
        // this.state.pan.setValue({x: 10});
        // }
        // this.state.pan.setValue({x: 10});
        this.state.pan.flattenOffset();

        this.state.pan.setValue({x: 10, y: 10});
        Animated.event([null, {
          dx: this.state.pan.x,
          dy: this.state.pan.y,
        }])(e, gestureState); 
      },

      // onPanResponderMove: (e, gestureState)=> {
      //   console.log(this.state.pan);
      //   this.state.pan.x._value > 50 ? null : Animated.event([
      //     null, 
      //     {dx: this.state.pan.x, dy: this.state.pan.y},
      //   ])(e, gestureState)
      // },

      onPanResponderRelease: (e, {vx, vy}) => {
        // Flatten the offset to avoid erratic behavior
        this.state.pan.flattenOffset();
        this.state.pan.setValue({x: 0, y: 0});

        Animated.spring(
          this.state.scale,
          { toValue: 1, friction: 3 }
        ).start();
      }
    });
  }

  constructor(props) {
    super(props);
    this.sock = new WebSocket('ws://192.168.0.24:8000');
    this.state = { 
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1),
      connectedText: 'no', 
      ipAddrText: 'ws://192.168.0.24:8000',
      base64img: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAHgAoADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0OiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooApT/61qZT5/wDWtTKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAKU/+tamU+f/AFrUygAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA0KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCncf65qjqS4/1zVHQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAaFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBTuP9c1R1Jcf65qjoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKANCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAp3H+uao6kuP9c1R0AFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAGhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAU7j/XNUdSXH+uao6ACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAKdx/rmqOpLj/AFzVHQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAaFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBTuP9c1R1Jcf65qjoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKANCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAp3H+uao6kuP9c1R0AFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAGhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAU7j/AFzVHUlx/rmqOgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA0KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCncf65qjqS4/1zVHQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAaFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBTuP9c1R1Jcf65qjoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKANCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAp3H+uao6kuP9a1R0AFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAGhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAU7j/Wmo6kuP9aajoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKANCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAp3H+tNR1Jcf601HQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAaFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBTuP9aajqS4/wBaajoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKANCisTzpf+er/wDfRo86X/nq/wD30aANuisTzpf+er/99Gjzpf8Anq//AH0aANuisTzpf+er/wDfRo86X/nq/wD30aANuisTzpf+er/99Gjzpf8Anq//AH0aANuisTzpf+er/wDfRo86X/nq/wD30aANuisTzpf+er/99Gjzpf8Anq//AH0aANuisTzpf+er/wDfRo86X/nq/wD30aANuisTzpf+er/99Gjzpf8Anq//AH0aANuisTzpf+er/wDfRo86X/nq/wD30aANuisTzpf+er/99Gjzpf8Anq//AH0aANuisTzpf+er/wDfRo86X/nq/wD30aANuisTzpf+er/99Gjzpf8Anq//AH0aANuisTzpf+er/wDfRo86X/nq/wD30aANuisTzpf+er/99Gjzpf8Anq//AH0aANuisTzpf+er/wDfRo86X/nq/wD30aANuisTzpf+er/99Gjzpf8Anq//AH0aANuisTzpf+er/wDfRo86X/nq/wD30aANuisTzpf+er/99Gjzpf8Anq//AH0aANuisTzpf+er/wDfRo86X/nq/wD30aANuisTzpf+er/99Gjzpf8Anq//AH0aANuisTzpf+er/wDfRo86X/nq/wD30aANuisTzpf+er/99Gjzpf8Anq//AH0aANuisTzpf+er/wDfRo86X/nq/wD30aANuisTzpf+er/99Gjzpf8Anq//AH0aANuisTzpf+er/wDfRo86X/nq/wD30aANuisTzpf+er/99Gjzpf8Anq//AH0aAL9x/rTUdMhYsgLEk+pNPoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAKFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBbt/9UKkqO3/1QqSgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAoUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAFu3/wBUKkqO3/1QqSgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAoUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAFu3/ANUKkqO3/wBUKkoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAKFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBbt/9UKkqO3/ANUKkoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAKFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBbt/9UKkqO3/1QqSgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAoUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAFmBgIwCRmpetUaOnSgC/RVIOw6MacJnHfP4UAW6KrC4buBThcDupoAnoqITofUU4SIf4hQA+ikBB6EGloAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAoUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUoZh0J/OkooAeJXH8VOE7d8GoqKAJxceq/rThOvcEVWooAtiVD3pwdT0YfnVKigC/RVEEjoaUSOP4jQBdoqoJnHcH8KcLg91FAFmioBcDuppwmT1I/CgCWimCRD/ABCnAg9DQAtFFFABRRRQBQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAHB2HRj+dOErjvUdFAEwnbuAaUXHqv61BRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH//2Q=='
    };
  }

  render() {
    let { pan } = this.state;
    // Calculate the x and y transform from the pan value
    let [translateX, translateY] = [pan.x, pan.y];
    
    // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
    let imageStyle = {transform: [{translateX}, {translateY}]};
    console.log('yeah'); 

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flex:1}}>
        <View style={{flex:2}}>
          <Image
            source={{uri: this.state.base64img}}
            style={{flex:1, width: undefined, height: undefined}} 
            // resizeMode={'contain'}
          />
        </View>
        <View style={{flex:3}}>
          <View style={{flexDirection:'row', flex:1, justifyContent:'center'}}>
            <TextInput
              style={{margin:5, borderBottomWidth:1, borderColor:'gray', marginHorizontal:10, paddingHorizontal:3, width:160, height:20}}
              value={this.state.ipAddrText}
              placeholder="input ip addr"
              onChangeText={(text) => this.setState({ipAddrText: text})}
            />
            <Button
                onPress={this._onPressButton.bind(this)}
                title="connect!"
                // color='blue'
            />
          </View>
          <View style={{flex:2, alignItems:'center'}}>
            <View style={styles.outer_circle}>
              <Animated.View {...this._panResponder.panHandlers} style={imageStyle}>
                <View style={styles.circle}></View>
              </Animated.View>
            </View>
          </View>
          <View style={[styles.circle, styles.circle_m]}></View>

        </View>
      </View>
      </SafeAreaView>
    );
  }
}

// skip this line if using Create React Native App
AppRegistry.registerComponent('MyFirstRNApp', () => AppView);
