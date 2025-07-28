export class Chunk {
	text: string;
	overlap: { prev: number; next: number };

	constructor(text: string, overlap: { prev: number; next: number }) {
		this.text = text;
		this.overlap = overlap;
	}

	get uniquePart(): string {
		return this.text.slice(
			this.overlap.prev,
			this.text.length - this.overlap.next,
		);
	}

	get overlapPart(): { prev: string; next: string } {
		return {
			prev: this.text.slice(0, this.overlap.prev),
			next: this.text.slice(this.text.length - this.overlap.next),
		};
	}

	get HasOverlapPart(): boolean {
		return this.overlap.prev !== 0 || this.overlap.next !== 0;
	}

	get HasOverlapNextPart(): boolean {
		return this.overlap.next !== 0;
	}
}
