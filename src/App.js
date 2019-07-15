import React, { useEffect, useReducer } from 'react';
import Navigation from './Navigation';
import StoryList from './StoryList';
import Loader from './Loader';
import getReddits from './staticData';
import debounce from "lodash.debounce";


const initialState = {
  navigationItems: [],
  selectedSubreddit: null,
  storyItems: [],
  afterCursor: "",
  loading: false
};

function reducer(state, action) {
  switch (action.type) {
    case 'set-navigation-items':
      return {
        ...state,
        navigationItems: action.payload,
      };
    case 'set-selected-subreddit':
      return {
        ...state,
        selectedSubreddit: action.payload,
        storyItems: [],
      };
    case 'set-story-items':
    return {
        ...state,
        storyItems: action.payload,
      };
    case 'set-after-cursor': 
    return {
        ...state,
        afterCursor: action.payload,
      };
    case 'set-loader': 
    return {
        ...state,
        loading: action.payload,
      };
    case 'append-story-items': 
    let storyItemsBk = state.storyItems;
    let newStoryItems = action.payload.filter( si => (si.data.post_hint === 'image' || si.data.post_hint === 'rich:video'));  
    return {
        ...state,
        storyItems: [...storyItemsBk, ...newStoryItems],
      };
    default:
      throw new Error();
  }
}

// Defining storiesCallbackName at the top so that the functions all the functions of the page can use it.
let storiesCallbackName = null;

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // setSelectedItem gets called when user clicks on any of the subreddits
  const setSelectedItem = (item) => {
    const documentHead = document.head;
    if (documentHead == null) throw new Error('No <head> to use for script injection.');
    dispatch({
      payload: true,
      type: 'set-loader',
    });
    const cbname = (storiesCallbackName = `fn${Date.now()}`); // setting cbname & storiesCallbackName with Date.now
    const script = document.createElement('script');
    script.src = `https://www.reddit.com/r/${item.title}.json?jsonp=${cbname}`;
    window[cbname] = (jsonData) => {
      // Process the response only if cbname matches the one we generated during the request 
      // so that if another request gets fired in the meantime it should ignore that
      if (cbname === storiesCallbackName) {
        let storyItems = jsonData.data.children.filter( si => (si.data.post_hint === 'image' || si.data.post_hint === 'rich:video'));  
        dispatch({
          payload: jsonData.data.after,
          type: 'set-after-cursor',
        });
        dispatch({
          payload: storyItems,
          type: 'set-story-items',
        });
        dispatch({
          payload: false,
          type: 'set-loader',
        });

        // As our application only shows images and videos, this line of code tries to fetchMoreItems 
        // if there are less than 2 image and video posts in the subreddit
        // But its an extremely bad logic, should think of something more workable
        if(storyItems.length < 2) fetchMoreItem(item, jsonData.data.after);
      }

      delete window[cbname];
      documentHead.removeChild(script);
    };

    // Start the JSONP request by setting the `src` of the injected script.
    documentHead.appendChild(script);

    dispatch({
      payload: item,
      type: 'set-selected-subreddit',
    });
  };

  // fetchMoreItem fetched more storyItems as we hit the bottom of the page
  const fetchMoreItem = (item, cursor) => {
    let subreddit = {};
    if(item) subreddit = item;
    else subreddit = state.selectedSubreddit;
    let subredditCursor = (cursor) ? cursor : state.afterCursor;
    const documentHead = document.head;
    if (documentHead == null) throw new Error('No <head> to use for script injection.');
    dispatch({
      payload: true,
      type: 'set-loader',
    });
    const cbname = (storiesCallbackName = `fn${Date.now()}`);
    const script = document.createElement('script');
    script.src = `https://www.reddit.com/r/${subreddit.title}.json?after=${subredditCursor}&jsonp=${cbname}`;
    window[cbname] = (jsonData) => {
      // Use the response only if this is still the latest script to run. If the user clicked
      // another Subreddit in the meantime, the `cbname` will be different and this response should
      // be ignored.
      //
      // The `<script>` must stay in the document even if the response is not needed because
      // otherwise the JSONP request will try to call a nonexistent script. Leave it in the `<head>`
      // so it can clean up after itself but make it do nothing other than clean up.
      if (cbname === storiesCallbackName) {
        
        dispatch({
          payload: jsonData.data.children,
          type: 'append-story-items',
        });
        dispatch({
          payload: jsonData.data.after,
          type: 'set-after-cursor',
        });
        dispatch({
          payload: false,
          type: 'set-loader',
        });
      }

      delete window[cbname];
      documentHead.removeChild(script);
    };

    // Start the JSONP request by setting the `src` of the injected script.
    documentHead.appendChild(script);
  };

  useEffect(() => {
    dispatch({
      payload: getReddits(),
      type: 'set-navigation-items',
    });
    setSelectedItem(getReddits()[0]);
  }, []);

  
  window.onscroll = debounce(() => {
    // Checks that the page has scrolled to the bottom
    if (
      window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight
    ) {
      fetchMoreItem();
    }
  }, 100);


  return (
    <React.Fragment>
      <Navigation
        items={state.navigationItems}
        itemSelected={setSelectedItem}
      />
      <StoryList items={state.storyItems} />
      <Loader loading={state.loading} />
    </React.Fragment>
  );
}