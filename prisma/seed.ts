import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()



async function main() {

    const data = [
        {
            "publishDate": null,
            "level1title": "Fussballspieler",
            "level1words": ["sommer", "keller", "hitz", "frei"],
            "level2title": "Musikerinnen",
            "level2words": ["winter", "button", "känzig", "gfeller"],
            "level3title": "Zürcher Wege",
            "level3words": ["laternen", "herbst", "panorama", "zelt"],
            "level4title": "Spät____",
            "level4words": ["frühling", "lese", "zünder", "i"]
        },
        {
            "publishDate": null,
            "level1title": "____grund",
            "level1words": ["ab", "letzi", "unter", "hinter"],
            "level2title": "Zürcher Areale",
            "level2words": ["hunziker", "hürlimann", "toni", "koch"],
            "level3title": "Zürcher Bier",
            "level3words": ["löwenbräu", "chopfab", "sprint", "amboss"],
            "level4title": "Schmied-Werkzeuge",
            "level4words": ["hammer", "glut", "wasser", "zange"]
        }
    ]
    const connections = []
    for (const item of data) {
        connections.push(await prisma.connection.create({
            data: {
                ...item,
            }
        }))
    }

    console.log(connections)
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })