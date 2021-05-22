import React from "react";

const NothingHere = ({text = null, icon = "folder"}) => {
	return (
		<section className="nothing-here">
			<article>
				<span className={`icon icon-${icon}`}></span>
				<p>
					{text || "nothing here"}
				</p>
			</article>
		</section>
	)
};

export default NothingHere;
