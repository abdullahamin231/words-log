import { Toaster } from "sonner";
import Footer from "./footer";
import Page from "./page";

function App() {
	return (
		<>
			<Toaster position="top-right" theme="dark" duration={2000} />
			<Page />
			<Footer />
		</>
	)
}

export default App
