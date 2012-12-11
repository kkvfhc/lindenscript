var iconTexture : Texture;
var nameOfObj : String = "Put your Object name";
var inventory : GameObject; //represents a reference to our inventory

private var decr : boolean;

function Start(){
	decr = false;	
}

function OnMouseOver(){
	if(transform.GetComponent(Equippable) != null){
		if(transform.GetComponent(Equippable).isEquipped())
			return;
	}
	ToggleAlpha(0.3,1);
	if(Input.GetMouseButtonDown(0)){
		renderer.material.color.a = 1;
		inventory.GetComponent(PositionController).SaveObjectInInventory(transform.gameObject);	
	}	
}

function OnMouseExit(){
	renderer.material.color.a = 1;
}

function ToggleAlpha(minV : float, maxV : float){
	if(renderer.material.color.a > minV && decr){
		renderer.material.color.a -= 1*Time.deltaTime;	
	} else {
		renderer.material.color.a += Time.deltaTime;
	}
	if(renderer.material.color.a > maxV){
		decr = true;	
	} else if(renderer.material.color.a < minV){
		decr = false;
	}
}
