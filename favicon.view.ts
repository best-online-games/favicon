namespace $.$$ {
	export class $bog_favicon extends $.$bog_favicon {

		@ $mol_mem
		override icon(): $.$mol_icon {
			return super.icon()
		}

		@ $mol_mem
		favicon_data(): string {
			const path = this.icon().path()
			const svg  = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${path}"/></svg>`
			return 'data:image/svg+xml,' + encodeURIComponent(svg)
		}

		apply_favicon(): void {
			const doc = this.$.$mol_dom_context.document
			if (!doc) return
			const href = this.favicon_data()
			for (const rel of ['icon','shortcut icon','apple-touch-icon'] as const) {
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

		override auto() { this.favicon_data(); this.apply_favicon(); return null as any }
		override sub() { return [] as const }
	}
}
