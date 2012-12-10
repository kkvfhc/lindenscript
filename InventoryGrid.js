var bagName : String = "Set a name for the bag";
var bagBtnName : String = "Bag button name here";
var posBagBtn : Vector2 = Vector2(50,50);//position of the bag button.

var slotSize : float = 40;
var spacingBetweenSlots : float = 5;
var defaultTextureSlot : Texture;
var bagNumber : int;//tell which bag is attached to this transform.

var bagBtn : GUIStyle;
var bagSlotBtn : GUIStyle;
var boxStyle : GUIStyle;

private var numSlots = 16;
private var offsetBag : int; //this is how much are we going to move the index in the parent's bag array
private var showBag : boolean = false; //shows or not this bag
private var bagPos : Vector2;
private var indexOnController : int;//represents an index for positioning the bag.

private var tmpTexture : Texture;

private var ctrl : PositionController;

function Start(){
	offsetBag = bagNumber * numSlots;
	ctrl = transform.parent.GetComponent(PositionController);
	
	indexOnController = 0;
}

function OnGUI(){
	if(GUI.Button(Rect(Screen.width	- posBagBtn.x, Screen.height - posBagBtn.y,slotSize,slotSize),bagBtnName,bagBtn)){
		ToggleBag();
	}
	
	if(showBag){
		Bag(bagPos.x, bagPos.y, 185,200); 	
	}
}

function ToggleBag(){
	if(showBag){
		HideBag();
	} else {
		ShowBag();
	}
}

function HideBag(){
	showBag = false;
	ctrl.FreePosition(indexOnController);
}

function ShowBag(){
	showBag = true;
	var info : Vector3 = ctrl.GetPositionAvailable();
	indexOnController = info.z;//position available for releasing when whe hide this bag
	bagPos = Vector2(info.x,info.y);//coords of the position available.
}

function BagIsBeingDisplayed(){
	return	showBag;
}

function Bag(posX : float, posY : float, sX : float, sY : float){
	GUI.BeginGroup(Rect(Screen.width - posX, Screen.height - posY, sX, sY));
	GUI.Box(Rect(0,0,sX,sY), bagName, boxStyle);
	
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			if(ctrl.GetObjectsInBag(offsetBag + (4*i)+j) == null){//there's no object in this slot, set the default texture
				tmpTexture = defaultTextureSlot;
			} else {
				tmpTexture = ctrl.GetObjectsInBag(offsetBag+(4*i)+j).GetComponent(ObjectInfo).iconTexture;//set the object's texture	
			}
			if(Input.GetMouseButtonDown(0)){
				ctrl.SetButtonClicked(false);	
			}
			if(GUI.Button(Rect(10 + slotSize*j + spacingBetweenSlots*(j+1),slotSize*i + spacingBetweenSlots*(i+1) + 30, slotSize, slotSize), tmpTexture,bagSlotBtn)){
				if(Input.GetKey(KeyCode.LeftControl)){//we want to equip the selected slot
					if(ctrl.GetObjectsInBag(offsetBag + (4*i)+j) != null){//the position is not empty
						if(ctrl.GetObjectsInBag(offsetBag + (4*i)+j).GetComponent(Equippable) != null){//the object that is inside the slot is equippable
							if(ctrl.GetObjectEquipped()){//if we have an object equipped already
								ctrl.GetObjectEq().GetComponent(Equippable).UnEquipObject();//un equip the object that was equipped.
							}
							ctrl.GetObjectsInBag(offsetBag + (4*i)+j).active = true;
							ctrl.GetObjectsInBag(offsetBag + (4*i)+j).GetComponent(Equippable).EquipObject();
							ReleaseSlot(offsetBag + (4*i)+j);
						}
					}
				} else {				
					ctrl.SetButtonClicked(true);
					if(ctrl.GetObjectsInBag(offsetBag + (4*i)+j) != null){//set a texture to our mouse cursor if we clicked a non-empty slot
						ctrl.mouseTextureHandler.SetCursor(ctrl.GetObjectsInBag(offsetBag + (4*i)+j).GetComponent(ObjectInfo).iconTexture);
						ctrl.SetObjAttached(true);
						
					} 
					MoveSlot(offsetBag + (4*i)+j);
				}
			}
		}
	}
	
	
	GUI.EndGroup();
}

function MoveSlot(indSlot : int){
	
	if(ctrl.GetObjectsInBag(indSlot) == null && !ctrl.GetSlotMovedFlag()){//case when we click in a new empty space (we are moving our item to a new one)
		ctrl.SetObjectInBag(indSlot, ctrl.GetObjectsInBag(ctrl.GetLastSlotUsed()));//assign the object to a new slot.
		ReleaseSlot(ctrl.GetLastSlotUsed());
		ctrl.SetSlotMovedFlag(true);
		ctrl.mouseTextureHandler.ReleaseCursorIcon();
		ctrl.SetObjAttached(false);
	} else if(ctrl.GetObjectsInBag(indSlot) != null && ctrl.GetObjectsInBag(ctrl.GetLastSlotUsed()) != null && !ctrl.GetSlotMovedFlag()){//swap two non-empty slots.
		var tmpObj : GameObject = ctrl.GetObjectsInBag(indSlot);
		ctrl.SetObjectInBag(indSlot, ctrl.GetObjectsInBag(ctrl.GetLastSlotUsed()));
		ctrl.SetObjectInBag(ctrl.GetLastSlotUsed(),tmpObj);
		ctrl.SetSlotMovedFlag(true);
		ctrl.mouseTextureHandler.ReleaseCursorIcon();
		ctrl.SetObjAttached(false);
	} else {
		ctrl.SetSlotMovedFlag(false);
	}
	ctrl.SetLastSlotUsed(indSlot);
}

function ReleaseSlot(index : int){
	ctrl.SetObjectInBag(index, null);	
}