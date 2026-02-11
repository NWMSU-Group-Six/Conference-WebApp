import { Button } from "@/components/ui/button";

function Home() {
  return (
    <>
      <h1>Examples of buttons:</h1>
      <Button>Click Me</Button>
      <Button size="xs">Click Me</Button>
      <Button variant="secondary">Click Me</Button>
      <Button variant="outline">Click Me</Button>
      <Button variant="ghost">Click Me</Button>
      <h1>Hello Cat Coding!</h1>
      <p>Welcome to the conference web app.</p>
    </>
  );
}

export default Home;
