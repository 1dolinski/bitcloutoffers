import { Fragment, useState, useEffect } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { DateTime } from 'luxon';
import Constants from './Constants'

var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyURduiO0k0SRGGY'}).base('appX3lOvCGm05jXmy');

const greenColor ="text-green-500" // For production build
const redColor ="text-red-500" // For production build

function PickRow(props) {
    const username = props.pick.fields["Username"];

  const price_added = props.pick.fields['Price_Added'];
  const current_price = props.pick.fields['Current_Price'];
  const created_at = props.pick.fields['Created_at'];
  const dollar_change = parseFloat(current_price) - parseFloat(price_added);
  const pct_change = ((parseFloat(current_price)/parseFloat(price_added)) - 1) * 100;

  var changeColor = dollar_change >= 0 ? "green": "red";

  return (
    <Fragment>
      <div className={`flex p-8 mb-4 border text-xl font-bold`}>
        <div class="flex-1">
          <a href={`https://bitclout.com/u/${username}`} className="font-semibold">{username.toUpperCase()}</a>
          <p className="text-gray-500 text-base">{DateTime.fromISO(created_at).toFormat('MMM dd H:mm')} EST @ ${price_added.toFixed(2)}</p>
        </div>
        <div className={`mr-16 text-base text-${changeColor}-500`}>
        <p>{pct_change.toFixed(2)}%</p>
        <p>${dollar_change.toFixed(2)}</p>
        </div>
        <p className={`text-${changeColor}-500`}>${current_price.toFixed(2)}</p>
      </div>

    </Fragment>
  )
}

export default function Bot() {

  const [page, setPage] = useState(1);
  const [picks, setPicks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
      base('BitcloutBot').select({
          // Selecting the first 3 records in @BitCloutOffers List:
          maxRecords: 100,
          sort: [
              {field: 'Created_at', direction: 'desc'}
          ],
          view: "BotPickList"
      }).eachPage(function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.
      
          setPicks(records);
          setIsLoading(false)
          // records.forEach(function(record) {
          //     console.log('Retrieved', record);
          // });
      
          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
      
      }, function done(err) {
          if (err) { console.error(err); return; }
      });
    }, [page]);



  return (
    <Fragment>
    <Popover className="relative bg-white overflow-hidden">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <svg
                className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
                fill="currentColor"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polygon points="50,0 100,0 50,100 0,100" />
              </svg>

              <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                <nav
                  className="relative flex items-center justify-between sm:h-10 lg:justify-start"
                  aria-label="Global"
                >
                  <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                    <div className="flex items-center justify-between w-full md:w-auto">
                      <a href="#">
                        <span className="sr-only">Workflow</span>
                        <img
                          className="h-8 w-auto sm:h-10"
                          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                        />
                      </a>
                      <div className="-mr-2 flex items-center md:hidden">
                        <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                          <span className="sr-only">Open main menu</span>
                          <MenuIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
                    {Constants.navigation.map((item) => (
                      <a key={item.name} href={item.href} className="font-medium text-gray-500 hover:text-gray-900">
                        {item.name}
                      </a>
                    ))}
                  </div>
                </nav>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="duration-150 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="duration-100 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Popover.Panel
                  focus
                  static
                  className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
                >
                  <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="px-5 pt-4 flex items-center justify-between">
                      <div>
                        <img
                          className="h-8 w-auto"
                          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                          alt=""
                        />
                      </div>
                      <div className="-mr-2">
                        <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                          <span className="sr-only">Close main menu</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                      </div>
                    </div>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                      {Constants.navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>

              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">We Highlight Verified Creator Coins</span>{' '}
                    <span className="block text-indigo-600 xl:inline">And Share Them With You</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Our watching in the tall grass. When it finds a healthy creator, it pounces. This page shares our keep. 
                  </p>
                </div>
              </main>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
              src="https://images.unsplash.com/flagged/photo-1579225818168-858da8667fae?ixlib=rb-1.2.1&ixid=1zO4O3Z0UJA&auto=format&fit=crop&w=2850&q=80"
              alt=""
            />
          </div>
        </>
      )}
    </Popover>

    <div className="max-w-7xl mx-auto mt-16">
      
      <p className="text-2xl font-bold mb-8">See The Bots Picks</p>
    {isLoading && <p>Wait I'm loading the bot picks for you</p>}

    {picks.map((c, index) => (
        <div key={index}>
          { (
            <>
              <PickRow pick={c} />
            </>
          )}
        </div>
      ))}
      </div>

    

    {/* <iframe className="airtable-embed" src="https://airtable.com/embed/shry9yR88eCGQsA6v?backgroundColor=cyan&viewControls=on" frameborder="0" onmousewheel="" width="100%" height="533" style={{"background": "transparent", "border": "1px solid #ccc"}}></iframe> */}
    </Fragment>
  )
}
