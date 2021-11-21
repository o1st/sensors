# Getting Started

Simple web application for working with browser WebSocket based on RCA.

You can:

1. Connect/Disconnect sensors one by one.
2. Filter Connected/All sensors

### `mpm i`

Go to folders client and server and run npm i command inside the folders

### `npm test`

To run client's tests.

### `Reflections`

1. The most interesting thing was implement WebSocket via hook.
2. The biggest part of time was spending for creation UIKit elements.
3. I see two things which can be improved here:
   a. It is work with data. When we receive a message, we are filtering and sorting array each time. (Time complexity is O(n) now). I believe we can choose another data structure (like a hash map) and get constantly time complexity O(1) here.
   b. It is work with data flow. Currently our app doesn't contain any state manager like a redux. If we add redux in our app and separate component Card on the smaller parts we'll be able to connect small components to redux and add memoization for the places which rerender very often (On this moment it is Value prop in Sensor type).
