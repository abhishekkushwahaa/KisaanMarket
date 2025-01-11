import React, { useState } from 'react';
import {Redirect, Stack} from 'expo-router';

export default function App() {
  const [loggedInUser] = useState(true);
  const [loading] = useState(false);
  return (
    <>
      {loading ? (
        <></>
      ) : (
          <Redirect href={!loggedInUser ? ("/(routes)/onboarding" as any) : "/(tabs)"} />
      )}
    </>
  );
}
