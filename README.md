
---

```md
# 🌸 Genshin Impact Guide Website

This is an open-source [Next.js](https://nextjs.org/) project that serves as a modular and visually appealing **Genshin Impact Guide Website**, featuring detailed character info, weapons, artifacts, and more — all powered by clean, JSON-based data.

Built with `create-next-app` and using modern web technologies like **Tailwind CSS**, **TypeScript**, and **App Router**.

---

## 🚀 Features

- Modular JSON data for easy scalability (characters, weapons, artifacts, substats, etc.)
- Filter system by **element**, **rarity**, and **weapon type**
- Responsive and dark-themed UI
- Per-character detail pages
- Optimized font loading using Poppins via `next/font`
- Multi-language support (planned)
- Ready for deployment on Vercel

---

## 🛠️ Installation & Development

### 1. Clone the repository

```bash
https://github.com/itzkazuri/genshinguide.git
cd genshin-guide
```

### 2. Install dependencies

Choose your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Once started, open [http://localhost:3000](http://localhost:3000) in your browser to view the site.

---

## 🧩 Project Structure (Simplified)

```
src/
├── app/
│   ├── characther/              # Character list & filter
│   │   └── [characthername]/    # Dynamic detail page
│   └── layout.tsx               # Global layout
├── components/                  # Reusable UI components
├── data/                        # Types and interfaces
├── public/
│   └── data/
│       ├── character/           # JSON per character
│       ├── weapon/              # Weapon data
│       └── resource/            # Resource icons
```

---

## 🧠 Editing the Project

You can start modifying the homepage by editing:

```
app/page.tsx
```

The page will auto-update as you edit the file.

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vercel Deployment Guide](https://nextjs.org/docs/app/building-your-application/deploying)

---

## 🚀 Deploy on Vercel

This project is fully compatible with [Vercel](https://vercel.com/) for fast and easy deployment.

Deploy instantly with:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app)

---

## 🙌 Contributing

Pull requests are welcome! If you find bugs, have suggestions, or want to contribute character data, feel free to open an issue or PR.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---


