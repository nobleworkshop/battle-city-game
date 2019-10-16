;(function () {
    'use strict'

    class Loader {
        constructor () {

            this.loadOrder = {
                images: [],
                jsons: []
            }

            this.resources = {
                images: [],
                jsons: []
            }
        }

        addImage (name, src) {
            this.loadOrder.images.push({name, src})
        }

        addJson (name, address) {
            this.loadOrder.jsons.push({name, address})
        }

        load (callback){
            const promises = []

            for ( const imageData of this.loadOrder.images) {
                const {name, src} = imageData
                const promise = Loader
                    .loadImage(src)
                    .then( image => {
                        this.resources.images[name] = image

                        if ( this.loadOrder.images.includes(imageData)) {
                            const index = this.loadOrder.images.indexOf(imageData)
                            this.loadOrder.images.splice(index, 1)
                        }
                    })
                    promises.push(promise)
            }

            for ( const jsonData of this.loadOrder.jsons) {
                const {name, address} = jsonData
                const promise = Loader
                    .loadJson(address)
                    .then( json => {
                        this.resources.jsons[name] = json

                        if ( this.loadOrder.jsons.includes(jsonData)) {
                            const index = this.loadOrder.jsons.indexOf(jsonData)
                            this.loadOrder.jsons.splice(index, 1)
                        }
                    })
                    promises.push(promise)
            }

            Promise.all(promises).then( () => callback() )
        }

        // Статический метод - это метод который принадлежит не экземплару класса (Объекту), а самому классу.
        static loadImage (src) {
            return new Promise( (resolve, reject) => {
                try {
                    // Создаем переменную image в которую записываем пустой объект типа Image
                    const image = new Image
                    // Добавляем метод onload (или он уже есть) в котром говорим что при 
                    // загрузке изображения будет вызываться ф-я resolve которую мы после передадим в промис
                    image.onload = () => resolve(image)
                    // Указываем значение свойства (атрибута) src для данного объекта с изображением
                    image.src = src
                }
                // Если код в try не сработает, то 
                catch (err) {
                    reject(err)
                }
            })
        }

        static loadJson (address){
            return new Promise((resolve, reject) => {
                fetch(address)
                    .then( result => result.json())
                    .then( result => resolve(result))
                    .catch( err => reject(err))
            })
        }
    }

    // Если window.GameEngine не пустой, то оставляем его.
    // Если window.GameEngine Пустой, тогда записываем в него пустой объект.
    // Далее в window.GameEngine мы будем записывать необходимые нам классы или объекты
    
    window.GameEngine = window.GameEngine || {}
    window.GameEngine.Loader = Loader;

})();