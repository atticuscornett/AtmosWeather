<script>
    let { children, name, page = $bindable(), onOpen, onClose } = $props();

    $effect(() => {
        console.log("page name - " + name);
        console.log("current page - " + page);


        let atmosSettings = JSON.parse(localStorage.getItem("atmos-settings"));
        if (!atmosSettings){
            atmosSettings = {};
        }
        if (!atmosSettings["personalization"]){
            atmosSettings["personalization"] = {};
        }
        if (!atmosSettings["personalization"]["page-transition-duration"]){
            atmosSettings["personalization"]["page-transition-duration"] = 1500;
        }
        console.log(atmosSettings);
        let duration = atmosSettings["personalization"]["page-transition-duration"] + "ms";
        let delay = atmosSettings["personalization"]["page-transition-duration"]/4;
        console.log(duration);

        if (page === name) {
            // Animate onto screen after delay
            setTimeout(function(){
                document.getElementById("tab-" + name).style.animation = `onRight ${duration}`;
                document.getElementById("tab-" + name).hidden = false;

                // Run page open function
                if (onOpen) {
                    onOpen();
                }
            }, delay);
        } else {
            // Animate off the screen
            document.getElementById("tab-" + name).style.animation = `offLeft ${duration}`;

            setTimeout(function(){
                document.getElementById("tab-" + name).style.animation = "";
                document.getElementById("tab-" + name).hidden = true;

                if (onClose) {
                    onClose();
                }
            }, delay);
        }
    });
</script>

<div class="tab-div" id="tab-{name}" hidden={name !== "locations"}>
    {@render children()}
</div>

<style>
    .tab-div{
        height: 92%;
        border: none;
        position: relative;
        margin-left: 20px;
        margin-right: 20px;
    }
</style>