import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useUser, useClerk } from "@clerk/clerk-expo";
import { Colors } from "../styles/colors";
import { Direction, Coordinate, GestureEventType } from "../types/types";
import { checkEatsFood } from "../utils/checkEatsFood";
import { checkGameOver } from "../utils/checkGameOver";
import { randomFoodPosition } from "../utils/randomFoodPosition";
import Food from "./Food";
import Header from "./Header";
import Score from "./Score";
import Snake from "./Snake";

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
const GAME_BOUNDS = { xMin: 0, xMax: 35, yMin: 0, yMax: 61 };
const MOVE_INTERVAL = 50;
const SCORE_INCREMENT = 1;

export default function Game(): JSX.Element {
const [direction, setDirection] = useState<Direction>(Direction.Right);
const [snake, setSnake] = useState<Coordinate[]>(SNAKE_INITIAL_POSITION);
const [food, setFood] = useState<Coordinate>(FOOD_INITIAL_POSITION);
const [score, setScore] = useState<number>(0);
const [isGameOver, setIsGameOver] = useState<boolean>(false);
const [isPaused, setIsPaused] = useState<boolean>(false);

const { user } = useUser();
const { client } = useClerk();

useEffect(() => {
if (!isGameOver) {
const intervalId = setInterval(() => {
!isPaused && moveSnake();
}, MOVE_INTERVAL);
return () => clearInterval(intervalId);
}
}, [snake, isGameOver, isPaused]);

const moveSnake = () => {
const snakeHead = snake[0];
const newHead = { ...snakeHead };

if (checkGameOver(snakeHead, GAME_BOUNDS)) {
setIsGameOver(true);
updateGamePoints(score); // Update game points on game over
return;
}

switch (direction) {
case Direction.Up:
newHead.y -= 1;
break;
case Direction.Down:
newHead.y += 1;
break;
case Direction.Left:
newHead.x -= 1;
break;
case Direction.Right:
newHead.x += 1;
break;
}

if (checkEatsFood(newHead, food, 2)) {
setFood(randomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax));
setSnake([newHead, ...snake]);
setScore(score + SCORE_INCREMENT);
} else {
setSnake([newHead, ...snake.slice(0, -1)]);
}

};

const handleGesture = (event: GestureEventType) => {
const { translationX, translationY } = event.nativeEvent;
if (Math.abs(translationX) > Math.abs(translationY)) {
if (translationX > 0) {
setDirection(Direction.Right);
} else {
setDirection(Direction.Left);
}
} else {
if (translationY > 0) {
setDirection(Direction.Down);
} else {
setDirection(Direction.Up);
}
}
};

const reloadGame = () => {
setSnake(SNAKE_INITIAL_POSITION);
setFood(FOOD_INITIAL_POSITION);
setIsGameOver(false);
setScore(0);
setDirection(Direction.Right);
setIsPaused(false);
};

const pauseGame = () => {
setIsPaused(!isPaused);
};

const updateGamePoints = async (newPoints: number) => {
if (!user) return;

try {
const currentPoints = user.unsafeMetadata?.gamePoints || 0;
const updatedPoints = currentPoints + newPoints;

await user.update({
unsafeMetadata: { gamePoints: updatedPoints },
});

// Force Clerk to refresh user data
await user.reload();

console.log("Game points updated:", updatedPoints);
} catch (error) {
console.error("Failed to update game points:", error);
}

};

return (
<PanGestureHandler onGestureEvent={handleGesture}>
<SafeAreaView style={styles.container}>

<Header reloadGame={reloadGame} pauseGame={pauseGame} isPaused={isPaused}>    
<Score score={score} />    
</Header>    
<View style={styles.boundaries}>    
<Snake snake={snake} />    
<Food x={food.x} y={food.y} />    
</View>    
</SafeAreaView>    
</PanGestureHandler>    
);    
}  const styles = StyleSheet.create({
container: {

width : "95%",  
alignSelf : "center",  
backgroundColor: Colors.primary,  
height : "100%",  
justifyContent : "center",

},
boundaries: {
height : 650,

borderColor: Colors.primary,  
borderWidth: 12,  
borderBottomLeftRadius: 30,  
borderBottomRightRadius: 30,  
backgroundColor: Colors.background,

},
});