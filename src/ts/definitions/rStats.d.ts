// http://spite.github.io/rstats/
// https://typescript.codeplex.com/wikipage?title=Writing%20Definition%20(.d.ts)%20Files

interface rStats_Static {
	new(options: any): rStats_Instance;
}

interface rStats_Instance {
	new(): rStats_Instance;
	update(): void;
	(s: string): PerfCounter;
	(): PerfCounter;
}

interface PerfCounter {
	start(): void;
	end(): void;
	tick(): void;
	frame(): void;
	update(): void;
	set(): void;
}

declare var rStats: rStats_Static;

declare var glStats: any;

declare var BrowserStats: any;