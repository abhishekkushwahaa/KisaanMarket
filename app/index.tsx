import React, { useState } from 'react';
import { Redirect } from 'expo-router';

export default function App() {
  const [loggedInUser] = useState(false);
  const [loading] = useState(false);
  return (
    <>
      {loading ? (
        <></>
      ) : (
        <Redirect href={!loggedInUser ? ("/(auth)" as any) : "/(tabs)"} />
      )}
    </>
  );
}
