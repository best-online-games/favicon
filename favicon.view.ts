namespace $ {
	/** Плагин, который ставит favicon из переданного $mol_icon_* и подобных */
	export class $bog_favicon extends $mol_plugin {
		@$mol_mem
		Icon(next?: { path(): string }): { path(): string } {
			if (next !== undefined) return next as never
			throw new Error('[bog_favicon] Icon is required: use `Icon <= icon $mol_icon_*` in view.tree')
		}

		@$mol_mem
		favicon_data(): string {
			const path = this.Icon().path()
			const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${path}"/></svg>`
			return 'data:image/svg+xml,' + encodeURIComponent(svg)
		}

		apply_favicon(): void {
			const doc = $mol_dom_context.document
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
