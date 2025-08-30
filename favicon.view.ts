namespace $.$$ {
	export type $bog_favicon_order = 'sequential' | 'reverse' | 'pingpong' | 'random'

	export class $bog_favicon extends $.$mol_plugin {
		@$mol_mem
		icons(next?: readonly { path(): string }[]): readonly { path(): string }[] {
			if (next !== undefined) return next as never
			return [] as const
		}

		@$mol_mem
		speed_ms(next?: number): number {
			if (next !== undefined) return Math.max(1, next | 0) as never
			return 1000
		}

		@$mol_mem
		stop_after_ms(next?: number): number {
			if (next !== undefined) return Math.max(0, next | 0) as never
			return 0
		}

		@$mol_mem
		order(next?: $bog_favicon_order): $bog_favicon_order {
			if (next !== undefined) return next as never
			return 'sequential'
		}

		@$mol_mem
		start_epoch(): number {
			return Date.now()
		}

		@$mol_mem
		tick(): number {
			const speed = this.speed_ms()
			const stop = this.stop_after_ms()

			const elapsed = Date.now() - this.start_epoch()
			const running = stop === 0 || elapsed < stop

			if (running) this.$.$mol_state_time.now(speed)

			const capped = stop ? Math.min(elapsed, stop) : elapsed
			return Math.floor(capped / speed)
		}

		@$mol_mem
		icon_index(): number {
			const list = this.icons()
			const len = Math.max(1, list.length)
			const t = this.tick()

			switch (this.order()) {
				case 'reverse':
					return len - 1 - (t % len)
				case 'pingpong': {
					const period = Math.max(1, 2 * len - 2)
					const p = period ? t % period : 0
					return p < len ? p : period - p
				}
				case 'random': {
					const x = Math.abs(Math.sin(t * 12.9898) * 43758.5453)
					return Math.floor(x) % len
				}
				case 'sequential':
				default:
					return t % len
			}
		}

		@$mol_mem
		current_icon(): { path(): string } {
			const list = this.icons()
			return list[this.icon_index()] ?? new this.$.$mol_icon_bird()
		}

		@$mol_mem
		favicon_data(): string {
			const path = this.current_icon()?.path?.() ?? ''
			const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${path}"/></svg>`
			return 'data:image/svg+xml,' + encodeURIComponent(svg)
		}

		apply_favicon(): void {
			const doc = this.$.$mol_dom_context.document
			if (!doc) return
			const href = this.favicon_data()
			for (const rel of ['icon', 'shortcut icon', 'apple-touch-icon'] as const) {
				let link = doc.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
				if (!link) {
					link = doc.createElement('link')
					link.rel = rel
					doc.head.appendChild(link)
				}
				link.type = 'image/svg+xml'
				if (link.href !== href) link.href = href
			}
		}

		override auto() {
			this.favicon_data()
			this.apply_favicon()
			return null as any
		}

		override sub() {
			return [] as const
		}
	}
}
