async function init_DomainSearch(){
  let domain = document.getElementById("DS_domain");
  let DSrowRestart = document.querySelectorAll('.rowRestart')
  
  // Check if user input is valid
  if (!domain.reportValidity()) {
      return
  }

  // displays the row/section where the results will appear
  show_suggested_rows()

  // Removes all previously displayed results  
  DSrowRestart.forEach((row) => {
    row.remove();
    
  });

  // Main Domain Search function 
  await results_DomainSearch()

   
}

// FETCH Suggestions 
async function results_DomainSearch() {
    let domain = document.getElementById("DS_domain").value;
    let data_domain;
   
   const response = await fetch('https://www.api-domai.com/generate/?query='+ domain + '&org_id=domaiioWEBADMIN' + '&TLDranking=[]', {
       method: 'GET',
       headers: {
       'Content-Type': 'application/json',
       }
   }).then(response => {
    const reader = response.body.getReader();
 
    // Read the stream
    return new ReadableStream({
      start(controller) {
        function pump() {
          return reader.read().then(({ done, value }) => {
            // When no more data needs to be consumed, close the stream
            if (done) {
              controller.close();
              return;
            }
 
            // Enqueue the next data chunk into our target stream
            controller.enqueue(value);
            // Continue pumping
            pump();
          });
        }
 
        pump();
      }
    });
  })
  .then(stream => {
    // Create a new ReadableStreamReader
    const reader = stream.getReader();
 
    // Read data from the stream as it becomes available
    function read() {
      reader.read().then(({ done, value }) => {
        if (done) {
            return;
        }
 
        // Process the data chunk
        const decoder = new TextDecoder('utf-8');
        const chunk = decoder.decode(value);
        
        data_domain = chunk.split(' ');
        
        
        data_domain.forEach((domain) => {

          // skips the current domain if it's empty or ','
          if (domain === '' || domain === ',') {
              return;
          }

          // Enter price function here
          // this is a placeholder function
          let price = getPrice(domain);
          let discountData = getDiscountedPrice(price)

          // Assembling of the results per row
          let domain_result = document.createElement('div');
          domain_result.className = 'row d-lg-flex d-flex justify-content-center align-items-center row-style-domains rowRestart';
          domain_result.setAttribute('name', domain); 
      
          domain_result.innerHTML = `
              <div class="col-12 d-flex justify-content-between align-items-center my-4 rowRestart">
                <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-start align-items-md-center w-100 ps-4">  
                  <span class="text-black domain-row-name">${domain}</span>
                  
                  <div class="d-flex flex-column">
                    <div class="d-flex justify-content-start align-items-end justify-content-md-end mt-3 mt-md-0">
                      <span class="align-content-end text-black domain-row-name discounted-price me-2">$${discountData.discounted_price}</span>
                      <span class="text-black domain-row-name">$${price}</span>
                    </div>

                    <div>
                      <span class="text-black domain-row-name discount-info">$${discountData.discount_details}</span>
                      
                      <img src="assets/info.svg" class="discount-info">
                      
                    </div>


                  </div>
                </div>  

                
                <button type="button" class="btn cart-box ms-md-3">
                  <img src="assets/cart.svg" class="cart-style"></img>
                </button>
                
              </div>
          `;
      
          const results_display = document.querySelector('.results_display');
      
          // Attaches the assembled result row in the HTML file
          results_display.insertAdjacentElement('beforeend', domain_result);
        });

        // Continue reading the stream
        read();
      }).catch(error => {
        console.error('Error reading stream:', error);
      });
    }
 
    // Start reading the stream
    read();
  })
  .catch(error => {
    console.error('Error fetching stream:', error);
  });
   
}; 




async function show_suggested_rows() {
    let suggestions_row = document.querySelector('.suggestions_section');

    if (!suggestions_row.classList.contains('d-flex')) {
        suggestions_row.classList.remove('d-none');
        suggestions_row.classList.add('d-flex');
        ; 
    }
}


function getPrice(domain){
  // add fetch API here

  return 99.99

}

function getDiscountedPrice(price){
  // add fetch API or conditions here

  let discountedprice = price - (price * 0.20)
  let discount_details = "1st yr only with 2 yr term"
  
  let discountData = {
    "discounted_price": parseFloat(discountedprice.toFixed(2)),
    "discount_details": discount_details
  }

  return discountData

}