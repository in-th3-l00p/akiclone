import {subtitle, title} from "@/components/primitives";
import React from "react";
import {Link} from "@nextui-org/link";
import {Button} from "@nextui-org/button";

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="flex flex-col justify-center items-center mb-8">
				<h1 className={title()}>
					<span className={"dark:text-purple-400 text-purple-500"}>Akinator</span> clone
				</h1>
				<h2 className={subtitle({ class: "text-center" })}>Using OpenAI GPT API</h2>
			</div>

			<Button
				as={Link}
				href={"/game"}
			>
				Start
			</Button>
		</section>
	);
}
