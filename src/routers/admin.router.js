const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')

const mongoose = require('mongoose')

AdminBro.registerAdapter(AdminBroMongoose)

const City = require('../models/city.model')
const Place = require('../models/place.model')

const adminBro = new AdminBro({
  databases: [mongoose],
  resources: [{
    resource: City,
    options: {
      parent: {
        name: 'Admin Content',
        icon: 'fas fa-cogs',
      },
      properties: {
        description: {
          type: 'richtext',
        },
      },
    },
  }, {
    resource: Place,
    options: {
      properties: {
        map: {
          isVisible: {
            show: true, edit: false, filter: false, list: false,
          },
          render: {
            show: (property, record, helpers) => {
              const html = `
              <div class="card-content">
                <div class="text-small">${property.name()}</div>
                <div id="map" style="width: 500px; height: 300px"></div>
              </div>
              <script>
                function initMap() {
                  var uluru = {
                    lat: ${record.param('location.lat')},
                    lng: ${record.param('location.lng')}
                  };
                  var map = new google.maps.Map(
                      document.getElementById('map'), {
                        zoom: 4, center: uluru
                      });
                  var marker = new google.maps.Marker({
                    position: uluru,
                    map: map
                  });
                }
              </script>
              `
              return html
            },
            head: {
              styles: [],
              scripts: ['https://maps.googleapis.com/maps/api/js?key=AIzaSyAELu9rK3EcURKn2BLWo008VlE_9JVRiGA&callback=initMap'],
            }
          }
        }
      }
    }
  }],
  rootPath: '/admin',
  branding: {
    logo: 'https://yt3.ggpht.com/-OHYrig1wHfY/AAAAAAAAAAI/AAAAAAAAAC0/hO4PnXj_Zps/s288-mo-c-c0xffffffff-rj-k-no/photo.jpg',
    companyName: 'JSCasts',
  }
})

const ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_PASSWORD || 'lovejs',
}

const router = AdminBroExpress.buildRouter(adminBro)

module.exports = router
